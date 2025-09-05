import moment from "moment";
import { getLocalDate } from "../../../../helpers/Utils";

export const useExtendedUserConfig = (users = []) => {
    return users.map((user, index) => ({
        "S/N": index + 1,
        Name: user.fullName ?? "",
        Phone: user.phone ?? "",
        "Expire date": user.paymentClearTo
            ? getLocalDate(user.paymentClearTo, "MMMM Do YYYY")
            : "",
        "Last payment expire date": user.lastPaymentClearTo
            ? getLocalDate(user.lastPaymentClearTo, "MMMM Do YYYY")
            : "",
        Day: Math.abs(
            moment(user.paymentClearTo).diff(
                moment(user.lastPaymentClearTo),
                "days"
            )
        ),
        Package: user.paymentPackage?.title,
        "Created By": user.createdBy?.fullName ?? "Prince",
    }));
};

export const useNoPaymentUserConfig = (users = []) => {
    return users.map((user, index) => ({
        "S/N": index + 1,
        Name: user.fullName ?? "",
        Phone: user.phone ?? "",
        "Expire date": user.paymentClearTo
            ? getLocalDate(user.paymentClearTo, "MMMM Do YYYY")
            : "",
        Day: Math.abs(
            moment(user.paymentClearTo).diff(moment(user.createdAt), "days")
        ),
        "Created By": user.createdBy?.fullName ?? "Prince",
    }));
};
