'use client';

import { useState, useEffect } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [repairRecords, setRepairRecords] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceBarcode, setDeviceBarcode] = useState("");
    const [deviceSerial, setDeviceSerial] = useState("");
    const [problem, setProblem] = useState("");
    const [solving, setSolving] = useState("");
    const [deviceId, setDeviceId] = useState('');
    const [expireDate, setExpireDate] = useState("");
    const [id, setId] = useState(0);

    const [showModalReceive, setShowModalReceive] = useState(false);
    const [receiveCustomerName, setReceiveCustomerName] = useState('');
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [receiveId, setReceiveId] = useState(0);

    useEffect(() => {
        fetchDevices();
        fetchRepairRecords();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/device/list`);
            setDevices(response.data);
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setId(0);
    }

    const handleChangeDevice = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if (device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpireDate(dayjs(device.expireDate).format("YYYY-MM-DD"));
        } else {
            setDeviceId('');
            setDeviceName("");
            setDeviceBarcode("");
            setDeviceSerial("");
            setExpireDate("");
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            customerPhone: customerPhone,
            deviceId: deviceId == '' ? undefined : deviceId,
            deviceName: deviceName,
            deviceBarcode: deviceBarcode,
            deviceSerial: deviceSerial,
            problem: problem,
            solving: solving == '' ? undefined : solving,
            expireDate: expireDate == '' ? undefined : new Date(expireDate),
        };

        try {
            if (id === 0) {
                await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
            }
            config.successDialog();

            setShowModal(false);
            fetchRepairRecords();
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const handleEdit = async (record: any) => {
        setId(record.id);
        setCustomerName(record.customerName);
        setCustomerPhone(record.customerPhone);

        if (record.deviceId) {
            setDeviceId(record.deviceId);
        }

        setDeviceName(record.deviceName);
        setDeviceBarcode(record.deviceBarcode);
        setDeviceSerial(record.deviceSerial);
        setProblem(record.problem);
        setExpireDate(dayjs(record.expireDate).format("YYYY-MM-DD"));

        setShowModal(true);
    }

    const handleDelete = async (id: number) => {
        try {
            const button = await config.confirmDialog();

            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/api/repairRecord/remove/${id}`);
                config.successDialog();
                fetchRepairRecords();
            }
        } catch (error: any) {
            config.errorDialog(error);
        }
    }

    const getStatusName = (status: string) => {
        switch (status) {
            case "active":
                return "รอซ่อม";
            case "pending":
                return "รอลูกค้ายืนยัน";
            case "repairing":
                return "กำลังซ่อม";
            case "done":
                return "ซ่อมเสร็จ";
            case "cancel":
                return "ยกเลิก";
            case "complete":
                return "ลูกค้ามารับอุปกรณ์";
            default:
                return "รอซ่อม";
        }
    }

    const openModalReceive = (repairRecord: any) => {
        setShowModalReceive(true);
        setReceiveCustomerName(repairRecord.customerName);
        setReceiveAmount(0);
        setReceiveId(repairRecord.id);
    }

    const closeModalReceive = () => {
        setShowModalReceive(false);
        setReceiveId(0);
    }

    const handleReceive = async () => {
        const payload = {
            id: receiveId,
            amount: receiveAmount,
        }

        await axios.put(`${config.apiUrl}/api/repairRecord/receive`, payload);

        fetchRepairRecords();
        closeModalReceive();
    }

    return (
        <>
            <div className="card">
                <h1>บันทึกการซ่อม</h1>
                <div className="card-body">
                    <button className="btn btn-primary" onClick={handleShowModal}>
                        <i className="fa-solid fa-plus mr-3"></i>
                        เพิ่มการซ่อม
                    </button>
                </div>
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th>ชื่อลูกค้า</th>
                            <th>เบอร์โทร</th>
                            <th>อุปกรณ์</th>
                            <th>อาการเสีย</th>
                            <th>วันที่รับซ่อม</th>
                            <th>วันที่ซ่อมเสร็จ</th>
                            <th>สถานะ</th>
                            <th className="text-right pr-8" style={{ paddingRight: '0px'}}>ค่าบริการ</th>
                            <th style={{ width: '330px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairRecords.map((record: any, index: number) => (
                            <tr key={index}>
                                <td>{record.customerName}</td>
                                <td>{record.customerPhone}</td>
                                <td>{record.deviceName}</td>
                                <td>{record.problem}</td>
                                <td>{dayjs(record.createAt).format("DD/MM/YYYY")}</td>
                                <td>{record.endJobDate ? dayjs(record.endJobDate).format("DD/MM/YYYY") : '-'}</td>
                                <td>{getStatusName(record.status)}</td>
                                <td className="text-right">{record.amount?.toLocaleString('th-TH')}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => openModalReceive(record)}>
                                            <i className="fa-solid fa-check mr-3"></i>
                                            รับเครื่อง
                                    </button>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(record)}>
                                        <i className="fa-solid fa-edit mr-3"></i>
                                        แก้ไข
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(record.id)}>
                                        <i className="fa-solid fa-trash mr-3"></i>
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title="เพิ่มการซ่อม"
                isOpen={showModal}
                onClose={handleCloseModal}
                size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input
                            type="text"
                            className="form-control w-full"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                        <div>เบอร์โทร</div>
                        <input
                            type="text"
                            className="form-control w-full"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)} />
                    </div>
                </div>
                <div className="mt-4">ชื่ออุปกรณ์ (ในระบบ)</div>
                <select
                    className="form-control w-full"
                    value={deviceId}
                    onChange={(e) => handleChangeDevice(e.target.value)}>
                    <option value="">--- เลือกอุปกรณ์ ---</option>
                    {devices.map((device: any) => (
                        <option key={device.id} value={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

                <div className="mt-4">ชื่ออุปกรณ์ (นอกระบบ)</div>
                <input
                    type="text"
                    className="form-control w-full"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)} />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <div>Barcode</div>
                        <input
                            type="text"
                            className="form-control w-full"
                            value={deviceBarcode}
                            onChange={(e) => setDeviceBarcode(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                        <div>Serial</div>
                        <input
                            type="text"
                            className="form-control w-full"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)} />
                    </div>
                </div>

                <div className="mt-4">วันหมดประกัน</div>
                <input
                    type="date"
                    className="form-control w-full"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)} />

                <div className="mt-4">อาการเสีย</div>
                <textarea
                    className="form-control w-full"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}>
                </textarea>

                <button
                    className="btn-primary mt-4"
                    onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </Modal>
            <Modal 
                title="รับเครื่อง" 
                isOpen={showModalReceive}
                onClose={() => closeModalReceive()}
                size="xl">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <div>ชื่อลูกค้า</div>
                            <input 
                                type="text" 
                                className="form-control w-full disabled" 
                                readOnly
                                value={receiveCustomerName}/>
                        </div>
                        <div className="w-1/2">
                            <div>ค่าบริการ</div>
                            <input 
                                type="text"
                                className="form-control w-full text-right"
                                value={receiveAmount}
                                onChange={(e) => setReceiveAmount(Number(e.target.value))}/>
                        </div>
                    </div>
                    <div>
                        <button className="btn-primary mt-4" onClick={handleReceive}>
                            <i className="fa-solid fa-check mr-3"></i>
                            บันทึก
                        </button>
                    </div>
            </Modal>
        </>
    );
}