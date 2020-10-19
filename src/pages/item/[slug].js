//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
//> NextJS
import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
//> SEO
import { NextSeo } from "next-seo";
//> Redux
// Basic Redux provider
import { connect } from "react-redux";
//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBJumbotron,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBCardTitle,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBSpinner,
  MDBBtn,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBView,
  MDBMask,
  MDBLightbox,
  MDBInput,
  MDBCard,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBAlert,
} from "mdbreact";

//> Redux
// Actions
import {
  tokenAuth,
  refreshToken,
  sendMessage,
} from "../../redux/actions/authActions";
import { getFlats, getImages, getPage } from "../../redux/actions/pageActions";
//> Components
//import { ScrollToTop } from "../components/atoms";
import { Navbar, Footer, CookieModal } from "../../components/molecules";
import { HeadSection, ContentBlock } from "../../components/organisms/sections";
//#endregion

//#region > Page
class Article extends React.Component {
  state = { pages: undefined, images: undefined };

  componentDidMount = () => {
    // Get tokens and page data
    this.props.tokenAuth();
    // Refresh token every 2 minutes (120000 ms)
    this.refreshInterval = window.setInterval(this.props.refreshToken, 120000);

    if (this.props.logged && (!this.props.pages || !this.props.images)) {
      // Get root page
      this.props.getFlats();
      // Get root page
      this.props.getPage();
      // Get all images
      this.props.getImages();
    } else if (this.props.pages && this.props.images && this.props.root) {
      this.setState({
        pages: this.props.pages,
        images: this.props.images,
        root: this.props.root,
      });
    }
  };

  componentDidUpdate = () => {
    const { pages, images, root } = this.state;

    if (this.props.logged && (!pages || !images)) {
      // Get root page
      this.props.getFlats();
      // Get root page
      this.props.getPage();
      // Get all images
      this.props.getImages();
    }

    // Set page state
    if (!pages && this.props.pages && this.props.logged) {
      this.setState({
        pages: this.props.pages,
      });
    }

    // Set page state
    if (!root && this.props.root && this.props.logged && !this.props.error) {
      this.setState({
        root: this.props.root[0],
      });
    }

    // Set all images as state
    if (!images && this.props.images && this.props.logged) {
      this.setState({
        images: this.props.images,
      });
    }
  };

  sendMsg = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { fullname, email, phone, note } = this.state;
    const { router } = this.props;

    const slug = router.query?.slug;
    const link = window.location?.origin;

    const success = await this.props.sendMessage(
      slug,
      link,
      fullname,
      "Miete",
      email,
      phone,
      note
    );

    if (success) {
      this.setState({
        msgSent: true,
      });
    } else {
      this.setState({
        msgSent: false,
      });
    }
  };

  render() {
    const { pages, root } = this.state;
    const { router } = this.props;

    const slug = router.query?.slug;
    const selectedPage = pages
      ? pages.length > 0
        ? pages.filter((p) => p.slug === slug)[0]
          ? pages.filter((p) => p.slug === slug)[0]
          : false
        : null
      : null;

    let images = [];

    if (selectedPage !== null && selectedPage !== false) {
      selectedPage.gallery.forEach((image) => {
        images = [
          ...images,
          {
            src: process.env.NEXT_PUBLIC_BASEURL + image.galleryImage.url,
          },
        ];
      });
    }

    return (
      <div className="flyout">
        {selectedPage !== null && selectedPage !== false && (
          <NextSeo
            title={selectedPage.title + " - TOP Immo"}
            description="Leistbar, top Qualität, top Lage. Das sind die Ansprüche der TOP Immo W.M. Treuhand GmbH als Bauträger am österreichischen Immobilienmarkt."
            canonical={"https://www.top-immo.org/item/" + selectedPage.slug}
            openGraph={{
              url: "https://www.top-immo.org/item/" + selectedPage.slug,
              title: selectedPage.title + " - TOP Immo",
              description:
                "Leistbar, top Qualität, top Lage. Das sind die Ansprüche der TOP Immo W.M. Treuhand GmbH als Bauträger am österreichischen Immobilienmarkt.",
              site_name: "TopImmo",
            }}
          />
        )}
        <Navbar />
        <main>
          <article>
            <MDBContainer className="mt-5 pt-5">
              {selectedPage !== null && selectedPage !== false ? (
                <div className="mt-5">
                  <MDBRow>
                    <MDBCol>
                      <MDBJumbotron className="text-center">
                        <MDBBreadcrumb className="mb-0 d-sm-none d-flex">
                          <Link href="/">
                            <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
                          </Link>
                          <MDBBreadcrumbItem onClick={() => router.back()}>
                            Projekt
                          </MDBBreadcrumbItem>
                          <MDBBreadcrumbItem active>
                            {selectedPage.title}
                          </MDBBreadcrumbItem>
                        </MDBBreadcrumb>
                        <MDBCarousel
                          activeItem={1}
                          length={selectedPage.headers.length}
                          showControls={selectedPage.headers.length > 1}
                          showIndicators={selectedPage.headers.length > 1}
                          className="z-depth-1"
                        >
                          <MDBCarouselInner>
                            {selectedPage.headers.map((item, i) => {
                              return (
                                <MDBCarouselItem itemId={i + 1}>
                                  <MDBView className="main-view">
                                    <div
                                      className="w-100 h-100 img-banner"
                                      style={{
                                        backgroundImage: `url("${
                                          process.env.NEXT_PUBLIC_BASEURL +
                                          item.slideImage.url
                                        }")`,
                                      }}
                                    ></div>
                                    <MDBMask
                                      overlay="black-slight"
                                      className="flex-center text-white text-center"
                                    />
                                  </MDBView>
                                </MDBCarouselItem>
                              );
                            })}
                          </MDBCarouselInner>
                        </MDBCarousel>
                        <MDBCardBody>
                          <MDBCardTitle className="h3 mt-3">
                            {selectedPage.title}
                          </MDBCardTitle>
                          {selectedPage.sections.map((section, s) => {
                            return (
                              <>
                                {(() => {
                                  switch (section.__typename) {
                                    case "Projects_S_ContentCenter":
                                      return <HeadSection data={section} />;
                                    case "Projects_S_ContentLeft":
                                      return (
                                        <ContentBlock
                                          data={section}
                                          orientation="left"
                                        />
                                      );
                                    case "Projects_S_ContentRight":
                                      return (
                                        <ContentBlock
                                          data={section}
                                          orientation="right"
                                        />
                                      );
                                    default:
                                      console.warn(
                                        "Unimplemented section " +
                                          section.__typename
                                      );
                                  }
                                })()}
                              </>
                            );
                          })}
                          <MDBLightbox md="4" images={images} />
                          <MDBRow className="flex-center">
                            <MDBCol lg="5">
                              <MDBCard className="text-left z-depth-0 my-4">
                                <MDBCardBody>
                                  {this.state.msgSent === undefined ? (
                                    <form onSubmit={(e) => this.sendMsg(e)}>
                                      <div className="md-form">
                                        <MDBInput
                                          icon="user"
                                          label="Name"
                                          iconClass="grey-text"
                                          type="text"
                                          id="form-name"
                                          name="fullname"
                                          onChange={(e) =>
                                            this.setState({
                                              [e.target.name]: e.target.value,
                                            })
                                          }
                                          value={this.state.fullname}
                                          outline
                                          required
                                        />
                                      </div>
                                      <div className="md-form">
                                        <MDBInput
                                          icon="envelope"
                                          label="E-Mail"
                                          iconClass="grey-text"
                                          type="email"
                                          id="form-name"
                                          name="email"
                                          onChange={(e) =>
                                            this.setState({
                                              [e.target.name]: e.target.value,
                                            })
                                          }
                                          value={this.state.email}
                                          outline
                                          required
                                        />
                                      </div>
                                      <div className="md-form">
                                        <MDBInput
                                          icon="phone"
                                          label="Telefonnummer (optional)"
                                          iconClass="grey-text"
                                          type="text"
                                          id="form-name"
                                          name="phone"
                                          onChange={(e) =>
                                            this.setState({
                                              [e.target.name]: e.target.value,
                                            })
                                          }
                                          value={this.state.phone}
                                          outline
                                        />
                                      </div>
                                      <div className="md-form">
                                        <MDBInput
                                          icon="pen"
                                          label="Notiz (optional)"
                                          iconClass="grey-text"
                                          type="textarea"
                                          id="form-text"
                                          name="note"
                                          onChange={(e) =>
                                            this.setState({
                                              [e.target.name]: e.target.value,
                                            })
                                          }
                                          value={this.state.note}
                                          outline
                                        />
                                      </div>
                                      <div className="text-center">
                                        <MDBBtn color="blue" type="submit">
                                          Senden
                                        </MDBBtn>
                                      </div>
                                    </form>
                                  ) : (
                                    <>
                                      {this.state.msgSent ? (
                                        <>
                                          <MDBAlert
                                            color="success"
                                            className="text-center"
                                          >
                                            <MDBIcon
                                              far
                                              icon="check-circle"
                                              size="2x"
                                            />
                                            <p className="mb-1 lead">
                                              Vielen Dank für Ihr Interesse.
                                            </p>
                                            <p>Wir melden uns bei Ihnen.</p>
                                          </MDBAlert>
                                        </>
                                      ) : (
                                        <>
                                          <MDBAlert
                                            color="danger"
                                            className="text-center"
                                          >
                                            <MDBIcon
                                              far
                                              icon="times-circle"
                                              size="2x"
                                            />
                                            <p className="mb-1 lead">
                                              Wir konnten Ihre Nachricht nicht
                                              zustellen.
                                            </p>
                                            <p>
                                              Bitte versuchen Sie es später
                                              erneut.
                                            </p>
                                          </MDBAlert>
                                        </>
                                      )}
                                    </>
                                  )}
                                </MDBCardBody>
                              </MDBCard>
                            </MDBCol>
                          </MDBRow>
                        </MDBCardBody>
                      </MDBJumbotron>
                    </MDBCol>
                  </MDBRow>
                </div>
              ) : (
                <>
                  {selectedPage === false ? (
                    <div className="text-center">
                      <p className="lead">
                        Der gewünschte Artikel ist leider nicht verfügbar.
                      </p>
                      <MDBBtn color="blue" href="/">
                        <MDBIcon icon="angle-left" />
                        Zurück
                      </MDBBtn>
                    </div>
                  ) : (
                    <div className="text-center">
                      <MDBSpinner blue />
                    </div>
                  )}
                </>
              )}
            </MDBContainer>
          </article>
          <CookieModal saveCookie={this.saveCookie} />
        </main>
        <Footer data={root} />
      </div>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => ({
  logged: state.auth.logged,
  pages: state.page.flats,
  root: state.page.root,
  images: state.page.images,
});

const mapDispatchToProps = {
  tokenAuth,
  refreshToken,
  getPage,
  getFlats,
  getImages,
  sendMessage,
};
//#endregion

//#region > Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Article));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 InspireMedia GmbH
 */
