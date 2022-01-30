import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import "./style.scss";

export default function Profile({ close }) {
  const history = useNavigate()
  const [img, setimg] = useState();
  const [user, setuser] = useState();
  const [values, setvalues] = useState({
    name: '',
    phone: ''
  });

  async function deleteImg() {
    const confirm = window.confirm("Dou want to delete?");
    if (confirm) {
      await deleteObject(ref(storage, user.imgPath));
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        img: "",
        imgPath: "",
      });
      updateUser();
    }
  }

  function valueHandler(e) {
    const name = e.target.name;
    const value = e.target.value;

    setvalues({
      ...values,
      [name]: value
    })
  }

  const updateUser = async () => {
    await getDoc(doc(db, "users", auth.currentUser.uid)).then((snap) => {
      setuser(snap.data());
      setvalues({
        name: snap.data().name,
        phone: snap.data()?.phone
      })
    });

  };

  useEffect(() => {
    updateUser();
    if (img) {

      const uploadImg = async () => {
        if (user && user.img) {
          try {
            await deleteObject(ref(storage, user.imgPath));
          } catch (err) {
            console.log("Last image does not exist!")
          }
        }
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()}-${img.name}`
        );
        const uploadedImg = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(
          ref(storage, uploadedImg.metadata.fullPath)
        );

        updateDoc(doc(db, "users", auth.currentUser.uid), {
          img: url,
          imgPath: uploadedImg.ref.fullPath,
        });
        updateUser();
      };
      uploadImg();
    }
  }, [img]);

  async function submitHandler(e) {
    e.preventDefault();
    if (values.name === '') return;
    console.log(values)
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: values.name,
        phone: values.phone
      })
    } catch (error) { }
    close()
  }

  return user ? (
    <div className="back-modal">
      <div className="editImgContent">
        <div className="top">
          <div className="title">Edit profile</div>
          <img
            src="https://img.icons8.com/ios-glyphs/30/ffffff/macos-close.png"
            onClick={close}
          />
        </div>
        <div className="main">


          {user.img ? (
            <div className="content img-overlay">
              <img src={user.img} alt="" />
              <div className="actions">
                <label>
                  <img
                    width="30px"
                    src="https://img.icons8.com/fluency-systems-filled/48/ffffff/edit-image.png"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="photo"
                    onChange={(e) => setimg(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>
                {user.img && (
                  <label onClick={deleteImg}>
                    <img src="https://img.icons8.com/ios-glyphs/30/ffffff/filled-trash.png" />
                  </label>
                )}
              </div>
            </div>
          ) :
            <label className="upload-new-img">
              <img
                width="30px"
                src="https://img.icons8.com/fluency-systems-filled/48/ffffff/edit-image.png"
              /> Upload
              <input
                type="file"
                accept="image/*"
                id="photo"
                onChange={(e) => setimg(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>}

          <form className="form" onSubmit={submitHandler}>
            <input type="text" value={values.name} name='name' onChange={valueHandler} />
            <input type="email" className="email" disabled value={user?.email} name='email' />
            <input type="text" pattern="998[0-9]{9}" onChange={valueHandler} value={values.phone} name='phone' placeholder="998 99 366 76 39" />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  ) : null;
}
