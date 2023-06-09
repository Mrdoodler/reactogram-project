import React, { useState, useEffect } from "react";
import "./profile.css";
import Modal from "react-bootstrap/Modal";
import { API_BASE_URL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.userReducer);
  const [image, setImage] = useState({ preview: "", data: "" });

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myallposts, setMyallposts] = useState([]);


  const [postDetail, setPostdetail] =  useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const [showPost, setShowPost] = useState(false);

  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  
  const deletePost = async(postId)=>{
    const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
    if( response.status === 200){
      getMyPosts();
      setShow(false);
    }
  }

  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };

  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);

    const response = axios.post(`${API_BASE_URL}/uploadFile`, formData);
    return response;
  };

  const getMyPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJ);
    if (response.status === 200) {
      setMyallposts(response.data.posts);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occurred while getting all your posts",
      });
    }
  };
  useEffect(() => {
    getMyPosts();
  }, []);

  const showDetail = (post)=>{
    setPostdetail(post)
  }

  const addPost = async () => {
    if (image.preview === "") {
      Swal.fire({
        icon: "error",
        title: "Post image is mandatory!",
      });
    } else if (caption === "") {
      Swal.fire({
        icon: "error",
        title: "Post caption is mandatory!",
      });
    } else if (location === "") {
      Swal.fire({
        icon: "error",
        title: "Location is mandatory!",
      });
    } else {
      setLoading(true);
      const imgRes = await handleImgUpload();
      //add validation rule for caption and Location
      const request = {
        description: caption,
        location: location,
        image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
      };
      //write api call to create post
      const postResponse = await axios.post(
        `${API_BASE_URL}/createpost`,
        request,
        CONFIG_OBJ
      );
      setLoading(false);
      if (postResponse.status == 201) {
        navigate("/posts");
      } else {
        Swal.fire({
          icon: "error",
          title: "Some error occurred while creating post",
        });
      }
    }
  };

  return (
    <div className="container shadow mt-3 p-4">
      <div className="row">
        <div className="col-md-6 d-flex flex-column">
          <img
            className="img-fluid p-2 profile-pic"
            alt="profile pic"
            src="https://images.unsplash.com/photo-1480497490787-505ec076689f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHdpbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
          />
          <p className="ms-3 fs-5 fw-bold">{user.user.email}</p>
          <p className="ms-3 fs-5 ">{user.user.fullName}</p>
          <p className="ms-3 fs-6 ">
            Web Developer @mrdoodler | Follow {user.user.fullName}
          </p>
          <p className="ms-3 fs-6 ">
            My protfolio on <a href="/">www.github.com/{user.user.fullName}</a>
          </p>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between mt-3 ">
          <div className="d-flex justify-content-equal mx-auto">
            <div className="count-section pe-4 pe-md-5 text-center fw-bold">
              <h4>{myallposts.length}</h4>
              <p>Posts</p>
            </div>
            <div className="count-section px-4 px-md-5 text-center fw-bold">
              <h4>10</h4>
              <p>Followers</p>
            </div>
            <div className="ps-md-5 ps-4 text-center fw-bold">
              <h4>10</h4>
              <p>Following</p>
            </div>
          </div>
          <div className="mx-auto mb-4 mt-md-0 mt-sm-4">
            <button
              type="submit"
              className="custom-btn custom-btn-white me-md-3 shadow"
            >
              <span className="fs-6">Edit Profile</span>
            </button>
            <button
              type="submit"
              className="custom-btn custom-btn-white  shadow"
              onClick={handlePostShow}
            >
              <span className="fs-6">Upload Posts</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 my-3">
          <hr />
        </div>
      </div>
      <div className="row mb-4">
      {myallposts.map((post) => {
          return (
            <div className="col-md-4 col-sm-12" key={post._id}>
            <div className="card" onClick={handleShow}>
              <img
                onClick={()=>showDetail(post)}
                src={post.image}
                className="card-img-top"
                alt={post.description}
              />
            </div>
          </div>
          );
        })}
        
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={postDetail.image}
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                      className=" d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6 d-flex">
                  <img
                    alt="profile pic"
                    className="p-2 profile-pic"
                    src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ludGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                  />
                  <div className="mt-2 ms-2">
                    <p className="fs-6 fw-bold">{postDetail.location}</p>
                    <p className="location">{postDetail.description}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dropdown ms-5">
                    <a
                      className="btn "
                      href="/"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa-solid fa-ellipsis fs-3 "></i>
                    </a>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <a className="dropdown-item" href="/">
                          <i className="fa-regular fa-pen-to-square px-2"></i>
                          Edit Post
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" onClick={()=>deletePost(postDetail._id)}>
                          <i  className="fa-solid fa-trash px-2"></i>
                          Delete Post
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <span className="p-2 text-muted">2 Hours Away</span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12 ms-2">
                  <p>Lorem ipsum</p>
                </div>
              </div>
              <div className="row my-3">
                <div className="col-6 d-flex ">
                  <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                  <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                  <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
                </div>
                <div className="col-12 mt-3 ms-2">
                  <span className="fs-6 fw-bold">200 likes</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className="fw-bold fs-6">Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-12 md-3">
              <div className="upload-box">
                <div className="dropZoneContainer">
                  <input
                    name="file"
                    type="file"
                    id="drop_zone"
                    className="FileUpload"
                    accept=".jpg,.png,.gif"
                    onChange={handleFileSelect}
                  />
                  <div className="dropZoneOverlay">
                    {image.preview && (
                      <img
                        alt="upload file"
                        src={image.preview}
                        width="150"
                        height="150"
                      />
                    )}
                    <i class="fa-solid fa-cloud-arrow-up fs-1"></i>
                    <br />
                    Upload Photo From Computer
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-between ">
              <div className="row">
                <div className="col-sm-12 mb-3 ">
                  <div className="form-floating">
                    <textarea
                      onChange={(ev) => setCaption(ev.target.value)}
                      className="form-control"
                      placeholder="Add Caption"
                      id="floatingTextarea"
                    ></textarea>
                    <label for="floatingTextarea">Add Caption</label>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={(ev) => setLocation(ev.target.value)}
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Add Location"
                    />
                    <label for="floatingInput">
                      <i className="fa-sharp fa-solid fa-location-pin pe-2"></i>
                      Location
                    </label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  {loading ? (
                    <div className="col-md-12 login-left mt-3 text-center">
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => addPost()}
                    type="submit"
                    className="custom-btn custom-btn-post float-end"
                  >
                    <span className="fs-6 fw-bold">Posts</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
