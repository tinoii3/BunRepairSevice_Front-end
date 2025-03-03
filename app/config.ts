import { error } from "console";
import Swal from "sweetalert2";

const config = {
  apiUrl: "http://localhost:3001",
  tokenKey: "token_bun_service",
  
  confirmDialog: () => {
    return Swal.fire({
      icon: "warning",
      iconColor: "red", //'#9ca3af'
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบรายการนี้หรือไม่",
      showCancelButton: true,
      background: "#1f2937", //#1f2937
      color: "#9ca3af", //#9ca3af
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },

  logoutDialog: () => {
    return Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบหรือไม่",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      showConfirmButton: true,
      background: "#1f2937",
      color: "#9ca3af",
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },

  successDialog: () => {
    return Swal.fire({
      title: "บันทึกข้อมูลสำเร็จ",
      icon: "success",
      iconColor: "",
      background: "#1f2937",
      color: "#9ca3af",
      timer: 1500,
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },

  errorDialog: (error: any) => {
    return Swal.fire({
      title: "error",
      icon: "error",
      text: error.message,
      iconColor: "red",
      background: "#1f2937",
      color: "#9ca3af",
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },

  notAcessDialog: (error: any) => {
    return Swal.fire({
      title: "No Access Permissions!",
      icon: "error",
      text: error.message,
      iconColor: "red",
      background: "#1f2937",
      color: "#9ca3af",
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
    });
  },
};

export default config;
