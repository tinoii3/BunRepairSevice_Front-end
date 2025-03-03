'use client';

import { useState, useEffect } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebookPage, setfacebookPage] = useState('');
    const [taxCode, setTaxCode] = useState('');

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const token = localStorage.getItem(config.tokenKey);
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const response = await axios.get(`${config.apiUrl}/api/company/info`, {
                headers: headers
            });

            if (response.data.id !== undefined) {
                setName(response.data.name);
                setAddress(response.data.address);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setfacebookPage(response.data.facebookPage);
                setTaxCode(response.data.taxCode);
            }
        } catch (error: any) {
            config.notAcessDialog(error);
        }
    }

    const saveCompany = async () => {
        try {
            const payload = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                facebookPage: facebookPage,
                taxCode: taxCode,
            }

            await axios.put(`${config.apiUrl}/api/company/update`, payload);
            config.successDialog();
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    return (
        <div className="card">
            <h1>ข้อมูลร้าน</h1>
            <div className="card-body">
                <div>ชื่อร้าน</div>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />


                <div className="mt-4">ที่อยู่</div>
                <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <div className="mt-4">เบอร์โทร</div>
                <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <div className="mt-4">อีเมล</div>
                <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="mt-4">Facebook Page</div>
                <input
                    type="text"
                    className="form-control"
                    value={facebookPage}
                    onChange={(e) => setfacebookPage(e.target.value)}
                />

                <div className="mt-4">เลขผู้เสียภาษี</div>
                <input
                    type="text"
                    className="form-control"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                />

                <button
                    className="btn btn-primary mt-4"
                    onClick={saveCompany}>
                    บันทึก
                </button>
            </div>
        </div>
    );
}