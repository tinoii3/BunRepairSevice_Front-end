"use client";

import Swal from "sweetalert2";
import config from "./config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DEMO_HINT_STORAGE_KEY = "tinoi_login_demo_hint_shown";

function showDemoAccessTipsDialog() {
  return Swal.fire({
    icon: "info",
    title: "Demo access",
    html: `
        <p class="text-left text-sm mb-3">ใช้บัญชีตัวอย่างด้านล่างได้เลย หรือดูรายละเอียดเพิ่มเติมใน <strong>README.md</strong> ของโปรเจกต์</p>
        <div class="text-left rounded-lg bg-gray-700/80 px-3 py-2 text-sm font-mono">
          <div><span class="text-gray-400">username:</span> admin</div>
          <div><span class="text-gray-400">password:</span> admin</div>
        </div>
      `,
    confirmButtonText: "เข้าใจแล้ว",
    background: "#1f2937",
    color: "#9ca3af",
    customClass: {
      title: "custom-title-class",
      htmlContainer: "custom-text-class",
    },
  });
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DEMO_HINT_STORAGE_KEY)) return;

    showDemoAccessTipsDialog().then(() => {
      sessionStorage.setItem(DEMO_HINT_STORAGE_KEY, "1");
    });
  }, []);

  const signIn = async (signInUsername: string, signInPassword: string) => {
    const response = await axios.post(`${config.apiUrl}/api/user/signin`, {
      username: signInUsername,
      password: signInPassword,
    });

    if (response.data.token !== undefined) {
      localStorage.setItem(config.tokenKey, response.data.token);
      localStorage.setItem("bun_service_name", response.data.user.username);
      localStorage.setItem("bun_service_level", response.data.user.level);

      router.push("/backoffice/dashboard");
      return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (username === "" || password === "") {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Username and password are required",
          iconColor: "red",
          background: "#1f2937",
          color: "#9ca3af",
          customClass: {
            title: "custom-title-class",
            htmlContainer: "custom-text-class",
          },
        });

        return;
      }

      const isSuccess = await signIn(username, password);

      if (isSuccess) {
        router.push("/backoffice/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Invalid username or password",
          iconColor: "red",
          background: "#1f2937",
          color: "#9ca3af",
          customClass: {
            title: "custom-title-class",
            htmlContainer: "custom-text-class",
          },
        });
      }

    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-800 to-gray-950">
      <div className="text-gray-400 text-4xl font-bold mb-10">
        ระบบ TinoiService
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">เข้าสู่ระบบ</h1>
          <button
            type="button"
            onClick={() => showDemoAccessTipsDialog()}
            className="shrink-0 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
            title="บัญชีทดลองและคำแนะนำ"
          >
            <i className="fa-solid fa-lightbulb mr-1.5" aria-hidden />
            Tips
          </button>
        </div>
        <form
          className="flex flex-col gap-2 mt-10 w-full"
          onSubmit={handleSubmit}
        >
          <div>
            <i className="fa fa-user mr-2"></i>
            Username
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="mt-5">
            <i className="fa fa-lock mr-2"></i>
            Password
          </div>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn mt-5 text-xl">
            <i className="fa fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
