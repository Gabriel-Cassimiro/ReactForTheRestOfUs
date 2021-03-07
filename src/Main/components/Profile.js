import React, { useEffect, useContext, useState } from "react"
import Page from "./Page"
import { useParams } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import ProfilePost from "./ProfilePost"

export default function Profile() {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetcthData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        setProfileData(response.data)
        //console.log(response.data)
      } catch (e) {
        console.log("therea was a problem seeing the profile")
      }
    }
    fetcthData() //Calls fetchData after defining it
    return () => {
      ourRequest.cancel()
    }
  }, [])

  return (
    <Page title={"Profile"}>
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsernames}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePost />
    </Page>
  )
}
