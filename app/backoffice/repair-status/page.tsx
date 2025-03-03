"use client";

import { useState, useEffect } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [repairRecords, setRepairRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
    const [status, setStatus] = useState("");
    const [solving, setSolving] = useState("");
    const [statusList, setStatusList] = useState([
        { value: "active", label: "รอซ่อม" },
        { value: "pending", label: "รอลูกค้ายืนยัน" },
        { value: "repairing", label: "กำลังซ่อม" },
        { value: "done", label: "ซ่อมเสร็จ" },
        { value: "cancel", label: "ยกเลิก" },
        { value: "complete", label: "ลูกค้ามารับอุปกรณ์" }
    ]);
    const [statusForFilter, setStatusForFilter] = useState("");
    const [tempRepairRecords, setTempRepairRecords] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [engineerId, setEngineerId] = useState(0);

    useEffect(() => {
        fetchRepairRecords();
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/user/list/engineers`);
            setEngineers(response.data);
            setEngineerId(response.data[0].id);
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
            setTempRepairRecords(response.data);
        } catch (error: any) {
            config.errorDialog(error);
        }
    };

    const handleEdit = (id: number) => {
        const repairRecord = repairRecords.find((record: any) => record.id === id) as any;

        if (repairRecord) {
            setEngineerId(repairRecord?.engineerId?? 0);
            setId(id);
            setStatus(repairRecord?.status ?? '');
            setSolving(repairRecord?.solving ?? '');
            setShowModal(true);
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                status: status,
                solving: solving,
                engineerId: engineerId
            };

            await axios.put(`${config.apiUrl}/api/repairRecord/updateStatus/${id}`, payload);
            setShowModal(false);
            setStatus("");
            setSolving("");

            config.successDialog();
            fetchRepairRecords();
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const handleFilter = (statusForFilter: string) => {
        if (statusForFilter) {
            const filteredRepairRecords = tempRepairRecords.filter((record: any) => record.status === statusForFilter);
            setRepairRecords(filteredRepairRecords);
            setStatusForFilter(statusForFilter);
        } else {
            setRepairRecords(tempRepairRecords);
            setStatusForFilter("");
        };
    }

    const getStatusName = (status: string) => {
        const statusItem = statusList.find((item: any) => item.value === status);
        return statusItem?.label ?? 'รอซ่อม';
    };

    return (
        <>
            <div className="card">
                <h1>สถานะการซ่อม</h1>
                <div>
                    <select
                        className="form-control"
                        value={statusForFilter}
                        onChange={(e) => handleFilter(e.target.value)}>
                        <option value="">--- ทั้งหมด ---</option>
                        {statusList.map((item: any) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="card-body">
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>ช่างซ่อม</th>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทร</th>
                                <th>อุปกรณ์</th>
                                <th>อาการเสีย</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันที่ซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th style={{ width: '170px' }} className="text-center">จัดการสถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any) => (
                                <tr key={repairRecord.id}>
                                    <td>{repairRecord.engineer?.username ?? '-'}</td>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDat).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleEdit(repairRecord.id)}
                                            className="btn-edit">
                                            <i className="fa-solid fa-edit mr-3"></i>
                                            ปรับสถานะ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                title="ปรับสถานะการซ่อม"
                isOpen={showModal}
                onClose={() => setShowModal(false)}>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>เลือกสถานะ</div>
                        <div>
                            <select
                                className="form-control w-full"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}>
                                {statusList.map((item: any) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div>ช่างซ่อม</div>
                        <select
                            className="form-control w-full"
                            value={engineerId}
                            onChange={(e) => setEngineerId(parseInt(e.target.value))}>
                            {engineers.map((engineer: any) => (
                                <option key={engineer.id} value={engineer.id}>
                                    {engineer.username}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-3">
                        <div>การแก้ไข</div>
                        <textarea
                            className="form-control w-full"
                            rows={5}
                            value={solving}
                            onChange={(e) => setSolving(e.target.value)}>
                        </textarea>
                    </div>

                    <button className="btn-primary mt-3" onClick={handleSave}>
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึก
                    </button>
            </Modal>
        </>
    );
}