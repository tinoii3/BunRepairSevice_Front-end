'use client';

import axios from "axios";
import config from "@/app/config";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Page() {
    const [totalRepairRecord, setTotalRepairRecord] = useState(0);
    const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] = useState(0);
    const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [listYear, setListYear] = useState<number[]>([]);
    const [listMonth, setListMonth] = useState([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]);
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYearChartIncomePerMonth, setSelectedYearChartIncomePerMonth] = useState(0);

    useEffect(() => {
        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const listYear = Array.from({ length: 5 }, (_, i) => currentYear - i);

        setListYear(listYear);
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
        setSelectedYearChartIncomePerMonth(currentYear);

        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        const params = {
            year: selectedYear,
            month: selectedMonth + 1,
        }
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`, {
            params: params,
        });

        setTotalAmount(response.data.totalAmount);
        setTotalRepairRecord(response.data.totalRepairRecord);
        setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
        setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);

        let listIncomePerDays = [];
        for (let i = 0; i < response.data.listIncomePerDays.length; i++) {
            listIncomePerDays.push(response.data.listIncomePerDays[i].amount);
        }

        renderChartIncomePerDays(listIncomePerDays);
        renderChartIncomePerMonth();
        renderChartPie(
            response.data.totalRepairRecord,
            response.data.totalRepairRecordComplete,
            response.data.totalRepairRecordNotComplete,
        );
    };

    const renderChartIncomePerDays = async (data: number[]) => {
        const ApexCharts = (await import("apexcharts")).default;
        const options = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`)
            },
        };

        const chartIncomePerDays = document.getElementById('chartIncomePerDays');
        const chart = new ApexCharts(chartIncomePerDays, options);
        chart.render();
    };

    const renderChartIncomePerMonth = async () => {
        const ApexCharts = (await import("apexcharts")).default;
        const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000));

        const options = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
                ]
            }
        };

        const chartIncomePerMonth = document.getElementById('chartIncomePerMonth');
        const chart = new ApexCharts(chartIncomePerMonth, options);
        chart.render();
    };

    const renderChartPie = (
        totalRepairRecord: number,
        totalRepairRecordComplete: number,
        totalRepairRecordNotComplete: number
    ) => {
        return import("apexcharts").then(({ default: ApexCharts }) => {
        const data = [totalRepairRecord, totalRepairRecordComplete, totalRepairRecordNotComplete];
        const options = {
            chart: { type: 'pie', height: 300, background: 'white' },
            series: data,
            labels: ['งานทั้งหมด', 'งานที่ซ่อมเสร็จ', 'งานที่กำลังซ่อม']
        };

        const chartPie = document.getElementById('chartPie');
        const chart = new ApexCharts(chartPie, options);
        chart.render();
        });
    }

    return (
        <>
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="flex mt-5 gap-4">
                <div className="w-1/4 bg-gradient-to-t from-indigo-700 to-indigo-400 p-4 rounded-lg mt-5 text-right">
                    <div className="text-xl font-bold">งานซ่อมทั้งหมด</div>
                    <div className="text-4xl font-bold">{totalRepairRecord}</div>
                </div>
                <div className="w-1/4 bg-gradient-to-t from-pink-700 to-pink-400 p-4 rounded-lg mt-5 text-right">
                    <div className="text-xl font-bold">งานกำลังซ่อม</div>
                    <div className="text-4xl font-bold">{totalRepairRecordNotComplete}</div>
                </div>
                <div className="w-1/4 bg-gradient-to-t from-red-700 to-red-400 p-4 rounded-lg mt-5 text-right">
                    <div className="text-xl font-bold">งานซ่อมเสร็จ</div>
                    <div className="text-4xl font-bold">{totalRepairRecordComplete}</div>
                </div>
                <div className="w-1/4 bg-gradient-to-t from-green-700 to-green-400 p-4 rounded-lg mt-5 text-right">
                    <div className="text-xl font-bold">รายได้เดือนนี้</div>
                    <div className="text-4xl font-bold">{totalAmount}</div>
                </div>
            </div>
            <div className="text-2xl font-bold mt-5">รายได้รายวัน</div>
            <div className="flex mb-3 mt-2 gap-4 items-end">
                <div className="w-[100px]">
                    <div>ปี</div>
                    <select
                        className="form-control"
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {listYear.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="w-[100px]">
                    <div>เดือน</div>
                    <select
                        className="form-control"
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {listMonth.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="w-[200px] ms-2">
                    <button className="btn" style={{ paddingRight: '20px', paddingLeft: '10px' }} onClick={fetchDashboard}>
                        <i className="fa-solid fa-magnifying-glass ms-3 pe-3"></i>
                        แสดงข้อมูล
                    </button>
                </div>
            </div>
            <div id="chartIncomePerDays"></div>

            <div className="text-2xl font-bold mt-5 mb-2">รายได้รายเดือน</div>
            <select
                className="form-control mb-2 mt-2"
                onChange={(e) => setSelectedYearChartIncomePerMonth(parseInt(e.target.value))}>
                {listYear.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
            <button className="btn ms-2" style={{ paddingRight: '20px', paddingLeft: '10px' }} onClick={fetchDashboard}>
                <i className="fa-solid fa-magnifying-glass ms-3 pe-3"></i>
                แสดงข้อมูล
            </button>

            <div className="flex gap-4">
                <div className="w-2/3">
                    <div id="chartIncomePerMonth"></div>
                </div>

                <div className="w-1/3">
                    <div id="chartPie"></div>
                </div>
            </div>
        </>
    );
}