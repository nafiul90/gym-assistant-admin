import { getLocalDate } from "../../../../helpers/Utils";

export const usePaymentConfig = (data = []) => {
    return data.map((payment, index) => ({
        "S/N": index + 1,
        Date: getLocalDate(payment.paymentClearTo, "MMMM Do YYYY"),
        Phone: `${payment.user?.phone} - ${payment.user?.fullName}`,
        Type: payment.paymentType ?? "",
        Package: payment.paymentPackage?.title ?? "",
        "Total amount":
            parseFloat(payment.totalAmount) + parseFloat(payment.admissionFee),
        Paid: payment.paidAmount ?? "",
        Discount: payment.discount ?? "",
        Due: Math.abs(payment.due ?? 0),
        "Created By": payment.createdBy?.fullName ?? "Prince Mahmud",
    }));
};
