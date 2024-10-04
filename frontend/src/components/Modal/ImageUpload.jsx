// import React, { useState } from "react";

// const ImageUpload = () => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const result = await response.json();
//       console.log(result);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       {preview && (
//         <img
//           src={preview}
//           alt="Image preview"
//           style={{ width: "100px", height: "auto" }}
//         />
//       )}
//       <button onClick={handleUpload}></button>
//     </div>
//   );
// };

// export default ImageUpload;
