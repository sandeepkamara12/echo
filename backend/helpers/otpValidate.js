export const otpOneMinuteValidation = async (otpTime) => {
    try {
        const current_date = new Date();
        let timeDifference = (otpTime - current_date.getTime()) / 1000;
        timeDifference /= 60;
        if (Math.abs(timeDifference) > 1) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}