import React from 'react'

interface ProfilePageProps {
  params: {
    id: string
  }
}

const ProfilePage = async ({params: {id}}: ProfilePageProps) => {
  
  
  console.log(id)
  
  return (
    <div>
      Profile page
    </div>
  )
}

export default ProfilePage
