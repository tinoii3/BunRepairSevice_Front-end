"use client";

import Swal from "sweetalert2";
import config from "./config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const router = useRouter();
  const isDemoAutoLoginEnabled =
    process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTO_LOGIN === "true";
  const demoUsername = process.env.NEXT_PUBLIC_DEMO_USERNAME;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

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

  useEffect(() => {
    const existingToken = localStorage.getItem(config.tokenKey);

    if (existingToken) {
      router.push("/backoffice/dashboard");
      return;
    }

    if (!isDemoAutoLoginEnabled || !demoUsername || !demoPassword) {
      return;
    }

    const autoLoginDemo = async () => {
      setIsAutoLoggingIn(true);

      try {
        await signIn(demoUsername, demoPassword);
      } catch (error) {
        console.error("Demo auto login failed", error);
      } finally {
        setIsAutoLoggingIn(false);
      }
    };

    autoLoginDemo();
  }, [demoPassword, demoUsername, isDemoAutoLoginEnabled, router]);

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
        <h1 className="text-2xl font-bold mb-4 text-white">
          <div>เข้าสู่ระบบ</div>
        </h1>
        {isAutoLoggingIn && (
          <div className="mt-4 rounded-lg border border-gray-600 bg-gray-700 p-3 text-sm text-gray-200">
            กำลังเข้าสู่ระบบ demo อัตโนมัติ...
          </div>
        )}
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
