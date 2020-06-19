import React from "react";
import "./scss/style.scss";
import { useHistory } from "react-router-dom";
export default function () {
  const history = useHistory();
  return (
    <div>
      <header id="header-section">
        <nav className="navbar navbar-expand-lg pl-3 pl-sm-0" id="navbar">
          <div className="container">
            <div className="navbar-brand-wrapper d-flex w-100">
              <img className={"logo"} src="images/logo.png" alt="" />
              <button
                className="navbar-toggler ml-auto"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="mdi mdi-menu navbar-toggler-icon" />
              </button>
            </div>
            <div
              className="collapse navbar-collapse navbar-menu-wrapper"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav align-items-lg-center align-items-start ml-auto">
                <li className="d-flex align-items-center justify-content-between pl-4 pl-lg-0">
                  <div className="navbar-collapse-logo">
                    <img className={"logo"} src="images/logo.png" alt="" />
                  </div>
                  <button
                    className="navbar-toggler close-button"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="mdi mdi-close navbar-toggler-icon pl-5" />
                  </button>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#header-section">
                    Pradžia <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features-section">
                    Apie
                  </a>
                </li>
                <li className="nav-item btn-contact-us pl-4 pl-lg-0">
                  <button
                    onClick={() => {
                      history.push("/quiz");
                    }}
                    className="btn btn-primary"
                  >
                    Pradedam
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="banner">
        <div className="container">
          <h1 className="font-weight-semibold">Už ką balsuotum tu?</h1>
          <h6 className="font-weight-normal text-muted pb-3">
            Balsuok už įstatymus ir sužinok kurie politikai
            labiausiai atitinka tavo interesus.
          </h6>
          <div>
            <button
              className="btn btn-primary mr-1"
              onClick={() => {
                history.push("/quiz");
              }}
            >
              Pradedam
            </button>
            <button className="btn btn-light ml-1">Sužinoti daugiau</button>
          </div>
          <img src="images/Group171.svg" alt="" className="img-fluid" />
        </div>
      </div>
      <div className="content-wrapper">
        <div className="container">
          <section className="features-overview" id="features-section">
            <div className="content-header">
              <h2>Kaip tai veikia?</h2>
              <h6 className="section-subtitle text-muted">
                One theme that serves as an easy-to-use operational toolkit
                <br />
                that meets customer's needs.
              </h6>
            </div>
            <div className="d-md-flex justify-content-between">
              <div className="grid-margin d-flex justify-content-start">
                <div className="features-width">
                  <img src="images/Group12.svg" alt="" className="img-icons" />
                  <h5 className="py-3">Ačiū Lietuva. Už skaidrumą</h5>
                  <p className="text-muted">
                    Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce
                    egeabus consectetuer turpis, suspendisse.
                  </p>
                  <a href="#">
                    <p className="readmore-link">Readmore</p>
                  </a>
                </div>
              </div>
              <div className="grid-margin d-flex justify-content-center">
                <div className="features-width">
                  <img src="images/Group7.svg" alt="" className="img-icons" />
                  <h5 className="py-3">Atrenkame populiariausius</h5>
                  <p className="text-muted">
                    Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce
                    egeabus consectetuer turpis, suspendisse.
                  </p>
                  <a href="#">
                    <p className="readmore-link">Readmore</p>
                  </a>
                </div>
              </div>
              <div className="grid-margin d-flex justify-content-end">
                <div className="features-width">
                  <img src="images/Group5.svg" alt="" className="img-icons" />
                  <h5 className="py-3">Pasveriame tavo balsą</h5>
                  <p className="text-muted">
                    Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce
                    egeabus consectetuer turpis, suspendisse.
                  </p>
                  <a href="#">
                    <p className="readmore-link">Readmore</p>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section
            className="digital-marketing-service"
            id="digital-marketing-section"
          >
            <div className="row align-items-center">
              <div
                className="col-12 col-lg-7 grid-margin grid-margin-lg-0"
                data-aos="fade-right"
              >
                <h3 className="m-0">Balsuokime protingai ir atsakingai.</h3>
                <div className="col-lg-7 col-xl-6 p-0">
                  <p className="py-4 m-0 text-muted">
                    Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce
                    egeabus consectetuer turpis, suspendisse.
                  </p>
                  <p className="font-weight-medium text-muted">
                    Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce
                    egeabus consectetuer
                  </p>
                </div>
              </div>
              <div
                className="col-12 col-lg-5 p-0 img-digital grid-margin grid-margin-lg-0"
                data-aos="fade-left"
              >
                <img src="images/Group1.png" alt="" className="img-fluid" />
              </div>
            </div>
            <div className="row align-items-center">
              <div
                className="col-12 col-lg-7 text-center flex-item grid-margin"
                data-aos="fade-right"
              >
                <img src="images/Group2.png" alt="" className="img-fluid" />
              </div>
              <div
                className="col-12 col-lg-5 flex-item grid-margin"
                data-aos="fade-left"
              >
                <h3 className="m-0">Sužinok kaip balsuoja kiti politikai</h3>
                <div className="col-lg-9 col-xl-8 p-0">
                  <p className="py-4 m-0 text-muted">
                    Power-packed with impressive features and well-optimized,
                    this template is designed to provide the best performance in
                    all circumstances.
                  </p>
                  <p className="pb-2 font-weight-medium text-muted">
                    Its smart features make it a powerful stand-alone website
                    building tool.
                  </p>
                </div>
                <button className="btn btn-info">Readmore</button>
              </div>
            </div>
          </section>
          <section className="contact-us" id="contact-section">
            <div className="contact-us-bgimage grid-margin">
              <div className="pb-4">
                <h4 className="px-3 px-md-0 m-0" data-aos="fade-down">
                  Sužinok tau labiausiai tinkančius politikus
                </h4>
              </div>
              <div data-aos="fade-up">
                <button className="btn btn-rounded btn-outline-danger" onClick={() => {
                  history.push("/quiz")
                }}>
                  Pradedam
                </button>
              </div>
            </div>
          </section>
          <section className="contact-details" id="contact-details-section">
            <div className="row text-center text-md-left">
              <div className="col-12 col-md-6 col-lg-3 grid-margin">
                <img
                  width={200}
                  height={"auto"}
                  src="images/logo.png"
                  alt=""
                  className="pb-2"
                />
                <div className="pt-2">
                  <p className="text-muted m-0">mikayla_beer@feil.name</p>
                  <p className="text-muted m-0">906-179-8309</p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3 grid-margin">
                <h5 className="pb-2">Get in Touch</h5>
                <p className="text-muted">
                  Don’t miss any updates of our new templates and extensions.!
                </p>
                <form>
                  <input
                    type="text"
                    className="form-control"
                    id="Email"
                    placeholder="Email id"
                  />
                </form>
                <div className="pt-3">
                  <button className="btn btn-dark">Subscribe</button>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3 grid-margin">
                <h5 className="pb-2">Our Guidelines</h5>
                <a href="#">
                  <p className="m-0 pb-2">Terms</p>
                </a>
                <a href="#">
                  <p className="m-0 pt-1 pb-2">Privacy policy</p>
                </a>
                <a href="#">
                  <p className="m-0 pt-1 pb-2">Cookie Policy</p>
                </a>
                <a href="#">
                  <p className="m-0 pt-1">Discover</p>
                </a>
              </div>
              <div className="col-12 col-md-6 col-lg-3 grid-margin">
                <h5 className="pb-2">Our address</h5>
                <p className="text-muted">
                  518 Schmeler Neck
                  <br />
                  Bartlett. Illinois
                </p>
                <div className="d-flex justify-content-center justify-content-md-start">
                  <a href="#">
                    <span className="mdi mdi-facebook" />
                  </a>
                  <a href="#">
                    <span className="mdi mdi-twitter" />
                  </a>
                  <a href="#">
                    <span className="mdi mdi-instagram" />
                  </a>
                  <a href="#">
                    <span className="mdi mdi-linkedin" />
                  </a>
                </div>
              </div>
            </div>
          </section>
          <footer className="border-top">
            <p className="text-center text-muted pt-4">
              Copyright © 2019
              <a href="https://www.bootstrapdash.com/" className="px-1">
                Bootstrapdash.
              </a>
              All rights reserved.
            </p>
          </footer>
          {/* Modal for Contact - us Button */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="exampleModalLabel">
                    Contact Us
                  </h4>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="Name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="Name"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="Email-1"
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Message">Message</label>
                      <textarea
                        className="form-control"
                        id="Message"
                        placeholder="Enter your Message"
                        defaultValue={""}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
