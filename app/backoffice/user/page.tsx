"use client";

import { useState, useEffect } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import { initialize } from "next/dist/server/lib/render-server";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [levels, setLevels] = useState(["admin", "user", "engineer"]);
  const [id, setId] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("admin");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departments, setDepartments] = useState([]);
  const [section, setSection] = useState([]);
  const [sectionId, setSectionId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);

  useEffect(() => {
    fetchData();

    const initializedData = async () => {
      await fetchDepartment();

      if (departments.length > 0) {
        const initialDepartmentId = (departments[0] as any).id;
        setDepartmentId(initialDepartmentId);
        await fetchSection(initialDepartmentId);
      }
    };

    initializedData();
  }, []);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/department/list`);
      setDepartments(response.data);
      setDepartmentId(response.data[0].id);
      fetchSection(response.data[0].id);
    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  const fetchSection = async (id: number) => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/api/section/listByDepartment/${id}`
      );
      setSection(response.data);
      setSectionId(response.data[0].id);
    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  const handleChangedDepartment = (departmentId: number) => {
    setDepartmentId(departmentId);
    fetchSection(departmentId);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/user/list`);
      setUsers(response.data);
    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (password !== confirmPassword) {
        Swal.fire({
          title: "error",
          icon: "error",
          text: "Password ไม่ตรงกัน",
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

      const payload = {
        username: username,
        password: password,
        level: level,
        sectionId: sectionId,
      };

      if (id === 0) {
        await axios.post(`${config.apiUrl}/api/user/create`, payload);
      } else {
        await axios.put(`${config.apiUrl}/api/user/updateUser/${id}`, payload);
        setId(0);
      }
      fetchData();
      handleCloseModal();

      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setLevel("admin");

      config.successDialog();
    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  const handleEdit = async (user: any) => {
    setId(user.id);
    setUsername(user.username);
    setLevel(user.level);
    setShowModal(true);

    const selectDepartment = user?.section?.department?.id ?? (departments[0] ? (departments[0] as any).id : 0);
    await fetchSection(selectDepartment);

    await fetchSection(selectDepartment).then(() => {
      setSectionId(user?.section?.id);
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const button = await config.confirmDialog();

      if (button.isConfirmed) {
        await axios.delete(`${config.apiUrl}/api/user/remove/${id}`);
        config.successDialog();
        fetchData();
      }
    } catch (error: any) {
      config.errorDialog(error);
    }
  };

  return (
    <div className="card">
      <h1>พนักงานร้าน</h1>
      <div className=" card-body">
        <button className="btn btn-primary" onClick={handleShowModal}>
        <i className="fa-solid fa-plus mr-2"></i>
          เพิ่มข้อมูล
        </button>

        <table className="table table-striped mt-5">
          <thead>
            <tr>
              <th>Username</th>
              <th style={{ width: '180px' }}>Level</th>
              <th>แผนก</th>
              <th>ฝ่าย</th>
              <th className="text-center" style={{ width: "220px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.level}</td>
                <td>{user?.section?.department?.name}</td>
                <td>{user?.section?.name}</td>
                <td className="text-center">
                  <button className="btn-edit" onClick={() => handleEdit(user)}>
                    <i className="fa-solid fa-edit mr-2"></i>
                    แก้ไข
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <i className="fa-solid fa-trash mr-2"></i>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="เพิ่มข้อมูลพนักงาน"
        isOpen={showModal}
        onClose={() => handleCloseModal()}
      >
        <div className="flex gap-4">
          <div className="w-1/2">
            <div>Department</div>
            <select
              className="form-control w-full"
              value={departmentId}
              onChange={(e) =>
                handleChangedDepartment(parseInt(e.target.value))
              }
            >
              {departments.map((department: any) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <div>Section</div>
            <select
              className="form-control w-full"
              value={sectionId}
              onChange={(e) => setSectionId(parseInt(e.target.value))}
            >
              {section.map((section: any) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>Username</div>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="mt-5">Password</div>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-5">Confirm Password</div>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="mt-5">Level</div>
        <select
          className="form-control w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((level: any) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary mt-5"
          onClick={() => {
            handleSave();
          }}
        >
          <i className="fa-solid fa-check mr-2"></i>
          บันทึก
        </button>
      </Modal>
    </div>
  );
}
