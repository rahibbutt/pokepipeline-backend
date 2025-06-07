"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromiseSettledResultData = void 0;
const getPromiseSettledResultData = (resultsData) => {
    const data = [];
    resultsData.forEach((result) => {
        if (result.status === "fulfilled") {
            data.push(result.value);
        }
    });
    return data;
};
exports.getPromiseSettledResultData = getPromiseSettledResultData;
