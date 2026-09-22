import { useState } from "react"

export default function useUserInformationLogic() {
    const storedProfile = (JSON.parse(sessionStorage.getItem("profile")!== null) ? JSON.parse(sessionStorage.getItem("profileCreated")) : sessionStorage.setItem("profileCreated", JSON.stringify(null)));
    const storedQrProfile = (JSON.parse(sessionStorage.getItem("QR Profile")!== null) ? JSON.parse(sessionStorage.getItem("QR Profile")) : sessionStorage.setItem("QR Profile", JSON.stringify(null)));
    const storedProfileEdit = (JSON.parse(sessionStorage.getItem("profile")!== null) ? JSON.parse(sessionStorage.getItem("profile")) : sessionStorage.setItem("profile", JSON.stringify(null)));
    const storedQrProfileEdit = (JSON.parse(sessionStorage.getItem("QR Profile")!== null) ? JSON.parse(sessionStorage.getItem("QR Profile Edited")) : sessionStorage.setItem("QR Profile Edited", JSON.stringify(null)));
  const [logoURL, setLogoURL] = useState("");
  const [coverURL, setCoverURL] = useState("");
    const [qrValue, setQrValue] = useState(storedProfile?.qrValue || "");
  const [name, setName] = useState("");
  const [activity, setActivity] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [menu, setMenu] = useState(null);
  const [menuPreviewUrl, setMenuPreviewUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookURL, setFacebookURL] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [tiktokURL, setTiktokURL] = useState("");
  const [whatsappURL, setWhatsappURL] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState( "");
  const [hasErrors, setHasErrors] = useState(false);
  const [resetForm, setResetForm] = useState(null);
  const [ errors, setErrors] = useState({})
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mode, setMode] = useState("login");

  const [profile, setProfile] = useState({
    qrValue: storedProfile?.qrValue || "",
    name: storedProfile?.name ||"",
    activity: storedProfile?.activity ||"",
    userName: storedProfile?.name|| "",
    bio: storedProfile?.bio ||"",
    email: storedProfile?.email ||"",
    address: storedProfile?.address ||"",
    menu: storedProfile?.menu ||"",
    phoneNumber: storedProfile?.phoneNumber ||"",
    facebookURL: storedProfile?.facebookURL ||"",
    instagramURL: storedProfile?.instagramURL ||"",
    tiktokURL: storedProfile?.tiktokURL ||"",
    whatsappNumber: storedProfile?.whatsappNumber ||"",
    whatsappURL: storedProfile?.whatsappURL ||"",
    logoURL: storedProfile?.logoURL || "",
    coverURL: storedProfile?.coverURL ||""
  })
  const [editrofile, setEditProfile] = useState({
    qrValue: storedProfileEdit?.qrValue || "",
    name: storedProfileEdit?.name ||"",
    activity: storedProfile?.activity ||"",
    userName: storedProfileEdit?.name|| "",
    bio: storedProfileEdit?.bio ||"",
    email: storedProfileEdit?.email ||"",
    address: storedProfileEdit?.address ||"",
    menu: storedProfileEdit?.menu ||"",
    phoneNumber: storedProfileEdit?.phoneNumber ||"",
    facebookURL: storedProfileEdit?.facebookURL ||"",
    instagramURL: storedProfileEdit?.instagramURL ||"",
    tiktokURL: storedProfileEdit?.tiktokURL ||"",
    whatsappNumber: storedProfileEdit?.whatsappNumber ||"",
    whatsappURL: storedProfileEdit?.whatsappURL ||"",
    logoURL: storedProfileEdit?.logoURL || "",
    coverURL: storedProfileEdit?.coverURL ||""
  })
  const [qrProfile, setQrProfile] = useState({
    name: storedQrProfile?.name ||"",
    activity: storedProfile?.activity ||"",
    userName: storedQrProfile?.userName ||"",
    bio: storedQrProfile?.bio ||"",
    email: storedProfile?.email ||"",
    address: storedProfile?.address ||"",
    menu: storedProfile?.menu ||"",
    phoneNumber: storedQrProfile?.phoneNumber ||"",
    facebookURL: storedQrProfile?.facebookURL ||"",
    instagramURL: storedQrProfile?.instagramURL ||"",
    tiktokURL: storedQrProfile?.tiktokURL ||"",
    whatsappNumber: storedQrProfile?.whatsappNumber ||"",
    whatsappURL: storedQrProfile?.whatsappURL ||"",
    logoURL: storedQrProfile?.logoURL || "",
    coverURL: storedQrProfile?.coverURL ||""
  })
  const [editQrProfile, setEditQrProfile] = useState({
    name: storedQrProfileEdit?.name ||"",
    activity: storedProfile?.activity ||"",
    userName: storedQrProfileEdit?.userName ||"",
    bio: storedQrProfileEdit?.bio ||"",
    email: storedProfile?.email ||"",
    address: storedProfile?.address ||"",
    menu: storedProfile?.menu ||"",
    phoneNumber: storedQrProfileEdit?.phoneNumber ||"",
    facebookURL: storedQrProfileEdit?.facebookURL ||"",
    instagramURL: storedQrProfileEdit?.instagramURL ||"",
    tiktokURL: storedQrProfileEdit?.tiktokURL ||"",
    whatsappNumber: storedQrProfileEdit?.whatsappNumber ||"",
    whatsappURL: storedQrProfileEdit?.whatsappURL ||"",
    logoURL: storedQrProfileEdit?.logoURL || "",
    coverURL: storedQrProfileEdit?.coverURL ||""
  });

  const handleCancel = () =>{
     sessionStorage.removeItem("profileCreated");
      sessionStorage.removeItem("QR Profile");
      setProfile({
        name: "",
        userName: "",
        activity: "",
        bio: "",
        email: "",
        address: "",
        menu: null,
        phoneNumber: "",
        facebookURL: "",
        instagramURL: "",
        tiktokURL: "",
        whatsappNumber: "",
        whatsappURL: "",
        logoURL: "",
        coverURL: "",
        logoURLPublicId: "",
        logoURLDeleteToken: "",
        coverURLPublicId: "",
        coverURLDeleteToken: "",
      });
      setQrProfile({
        name: "",
        userName: "",
        activity: "",
        bio: "",
        email: "",
        address: "",
        menu: null,
        phoneNumber: "",
        facebookURL: "",
        instagramURL: "",
        tiktokURL: "",
        whatsappNumber: "",
        whatsappURL: "",
        logoURL: "",
        coverURL: "",
      });
      setName("");
      setActivity("");
      setBio("");
      setEmail("");
      setAddress("");
      setMenu(null);
      setPhoneNumber("");
      setFacebookURL("");
      setInstagramURL("");
      setTiktokURL("");
      setWhatsappNumber("");
      setWhatsappURL("");
      setQrValue("");
  }

  return {
    logoURL,
    coverURL,
    name,
    activity,
    bio,
    phoneNumber,
    facebookURL,
    instagramURL,
    tiktokURL,
    whatsappURL,
    profile,
    editrofile,
    editQrProfile,
    whatsappNumber,
    qrProfile,
    errors,
    hasErrors,
    qrValue,
    resetForm,
    isSidebarOpen,
    mode,
    email,
    menu,
    address,
    menuPreviewUrl,

    setLogoURL,
    setCoverURL,
    setName,
    setActivity,
    setBio,
    setPhoneNumber,
    setFacebookURL,
    setInstagramURL,
    setTiktokURL,
    setWhatsappURL,
    setProfile,
    setEditProfile,
    setEditQrProfile,
    setWhatsappNumber,
    setQrProfile,
    setErrors,
    setHasErrors,
    setQrValue,
    setResetForm,
    setIsSidebarOpen,
    setMode,
    setEmail,
    setMenu,
    setAddress,
    setMenuPreviewUrl,

    handleCancel,
  }
}
