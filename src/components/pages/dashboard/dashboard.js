import React from "react";
import { useGetAllData } from "../../common/useGetAllData";
import {
    GET_ALL_GYM,
    GET_ALL_INVOICE,
    IMAGE_URL,
} from "../../../helpers/Constant";
import PageWrapper from "../../common/PageWrapper";
import moment from "moment";
import dayjs from "dayjs";

const Dashboard = () => {
    const { dataList } = useGetAllData(`${GET_ALL_GYM}?active=true&size=1000`);
    let today = new Date();
    today.setDate(1);
    // today.setDate(today.getDate() - 1);
    today = moment(today).format("DD MMMM YYYY");
    today = dayjs(today);

    const { summary } = useGetAllData(`${GET_ALL_INVOICE}?from=${today}`);
    const { summary: monthly } = useGetAllData(
        `${GET_ALL_INVOICE}?from=${today}&type=Monthly Fee`,
    );
    const { summary: expense } = useGetAllData(
        `${GET_ALL_INVOICE}?from=${today}&invoiceType=Expense`,
    );

    const dueMonths = (clearTo) => {
        if (!clearTo) return 1;
        clearTo = new Date(clearTo);
        const today = new Date();
        return today.getMonth() - clearTo.getMonth();
    };

    const getAllUnpaidGym = () => {
        return dataList.filter((gym) => dueMonths(gym.paymentClearTo));
    };

    const getAllPaidGym = () => {
        return dataList.filter((gym) => dueMonths(gym.paymentClearTo) === 0);
    };

    const getGym = (e) => {
        return (
            <div
                key={e._id}
                className="flex flex-col items-center bg-white rounded-xl shadow-md p-3"
            >
                {/* <img src={`${IMAGE_URL}/${e.logo}`} />
                            <p>{e.gymName}</p> */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                        src={
                            e.logo
                                ? `${IMAGE_URL}/${e.logo}`
                                : "/gym_logo_b.png"
                        }
                        alt="Gym Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-700 text-center truncate w-full">
                    {e.gymName}
                </p>
            </div>
        );
    };

    return (
        <PageWrapper pageHeader={""}>
            <div className="p-5">
                <div className="flex gap-5 pb-5 flex-col md:flex-row">
                    <div className="h-[160px] w-[200px] p-5 rounded-md shadow-md">
                        <p className="text-xl mb-2">This Month Total</p>
                        <p className="font-semibold ">
                            Monthly fee: {monthly?.totalFinalPrice?.toFixed(0)}
                        </p>
                        <p>All: {summary?.totalFinalPrice?.toFixed(0)}</p>
                        <p className="text-red-500">
                            Expense: {expense?.totalFinalPrice?.toFixed(0)}
                        </p>
                        <p className="font-semibold mt-2">
                            {" "}
                            Total Revenew:
                            {(
                                summary?.totalFinalPrice -
                                expense?.totalFinalPrice
                            ).toFixed(0)}
                        </p>
                    </div>
                    <div className="h-[160px] w-[200px] p-5 rounded-md shadow-md">
                        <p className="text-xl mb-2 text-green">Paid</p>
                        <p className="font-semibold ">
                            Monthly fee: {monthly?.totalCollection?.toFixed(0)}
                        </p>
                        <p>All: {summary?.totalCollection?.toFixed(0)}</p>

                        <p className="text-red-500">
                            Expense: {expense?.totalCollection?.toFixed(0)}
                        </p>
                        <p className="font-semibold mt-2">
                            {" "}
                            Balance:
                            {(
                                summary?.totalCollection -
                                expense?.totalCollection
                            ).toFixed(0)}
                        </p>
                    </div>
                    <div className="h-[160px] w-[200px] p-5 rounded-md shadow-md">
                        <p className="text-xl mb-2 text-red-500">Due</p>
                        <p className="font-semibold ">
                            {" "}
                            Monthly Fee:
                            {(
                                monthly?.totalFinalPrice - monthly?.totalPaid
                            ).toFixed(0)}
                        </p>
                        <p>
                            {" "}
                            All:
                            {(
                                summary?.totalFinalPrice - summary?.totalPaid
                            ).toFixed(0)}
                        </p>

                        <p className="text-red-500">
                            {" "}
                            Expense:
                            {(
                                expense?.totalFinalPrice - expense?.totalPaid
                            ).toFixed(0)}
                        </p>
                    </div>
                    <div className="h-[160px] w-[200px] p-5 rounded-md shadow-md">
                        <p className="text-xl mb-2">Summary</p>

                        <p className="font-semibold ">
                            {" "}
                            Current Balance:
                            {(
                                summary?.totalCollection -
                                expense?.totalCollection
                            ).toFixed(0)}
                        </p>
                        <p className="font-semibold">
                            {" "}
                            Revenew:
                            {(
                                summary?.totalCollection -
                                expense?.totalFinalPrice
                            ).toFixed(0)}
                        </p>
                    </div>
                </div>
                <p className="text-2xl pb-5">
                    Unpaid gyms ({getAllUnpaidGym().length})
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    {getAllUnpaidGym().map((e) => getGym(e))}
                </div>
                <p className="text-2xl pb-5 pt-10">
                    Paid gyms ({getAllPaidGym().length})
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    {getAllPaidGym().map((e) => getGym(e))}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard;
