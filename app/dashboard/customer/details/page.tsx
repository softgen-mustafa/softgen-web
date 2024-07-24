"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Button, CircularProgress } from "@mui/material";
import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { handleCall, handleEmail, handleMapPress } from "./helper";

const CustomerDetailsScreen = ({}) => {
  const [ledgerDetail, setLedgerDetail] = useState<any>({});
  const [isDataLoading, setLoadingStatus] = useState(false);
  const [outstandingAmount, setOutstandingAmount] = useState("-");

  const filterValue = localStorage.getItem("party_filter_value");

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      setLoadingStatus(true);
      let url = `${getBmrmBaseUrl()}/ledger/${filterValue}`;
      console.log("CustomerDetailsScreen", url)
      let response = await getAsync(url);
      setLedgerDetail(response);

      url = `${getBmrmBaseUrl()}/bill/customer-outstanding/${filterValue}`;
      response = await getAsync(url);
      if (!response) {
        response = { total_amount: 0 };
      }
      setOutstandingAmount(response.total_amount || "-");
    } catch {
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex items-center p-4">
        <Typography variant="h6" className="ml-4">
          {"Customer Details"}
        </Typography>
      </div>
      <div className="overflow-auto">
        <Card className="m-4 p-4">
          {isDataLoading ? (
            <CircularProgress />
          ) : (
            <div>
              <Typography variant="h5" className="font-medium mb-2">
                {"Basic Info"}
              </Typography>
              <Card className="bg-gray-100 rounded-lg p-4 mb-4">
                <InfoItem label={"Name,"} value={ledgerDetail.name} />
                <InfoItem
                  label={"Alias Name,"}
                  value={ledgerDetail.alias ?? "-"}
                />
                <InfoItem
                  label={"Current Outstanding,"}
                  value={outstandingAmount}
                />
                <InfoItem
                  label={"Credit Limit"}
                  value={ledgerDetail.creditLimit ?? "-"}
                />
                <div className="flex justify-between">
                  <InfoItem
                    label={"Credit Period"}
                    value={ledgerDetail.creditPeriod ?? "-"}
                  />
                  <InfoItem
                    label={"Opening Balance"}
                    value={`${ledgerDetail.currency} ${numericToString(
                      ledgerDetail.openingBal?.amount ?? "0"
                    )}`}
                    align="right"
                  />
                </div>
                <div className="flex justify-between">
                  <InfoItem
                    label={"Group,"}
                    value={ledgerDetail.group ?? "-"}
                  />
                  <InfoItem
                    label={"Pan Number,"}
                    value={ledgerDetail.panNumber ?? "-"}
                    align="right"
                  />
                </div>
              </Card>

              <Typography variant="h5" className="font-medium mb-2">
                {"Contact Detail,"}
              </Typography>
              <Card className="bg-gray-100 rounded-lg p-4 mb-4">
                <InfoItem
                  label={"Contact Person Name,"}
                  value={ledgerDetail.contactPerson ?? "-"}
                />
                <div className="flex justify-between">
                  <Button onClick={() => handleCall([ledgerDetail.mobileNo])}>
                    <InfoItem
                      label={"Mobile No,"}
                      value={ledgerDetail.mobileNo ?? "-"}
                    />
                  </Button>
                  <Button
                    onClick={() =>
                      handleCall(
                        ledgerDetail.landlineNo
                          ?.split(/[&/,]/)
                          .map((num: string) => num.trim())
                      )
                    }
                  >
                    <InfoItem
                      label={"Landline No,"}
                      value={ledgerDetail.landlineNo ?? "-"}
                      align="right"
                    />
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleEmail(
                      ledgerDetail.email
                        ?.split(/[,&/\s;]+/)
                        .map((email: string) => email.trim())
                    )
                  }
                >
                  <InfoItem
                    label={"Email,"}
                    value={ledgerDetail.email ?? "-"}
                  />
                </Button>
                <Button
                  onClick={() =>
                    handleEmail(
                      ledgerDetail.emailcc
                        ?.split(/[,&\s;]+/)
                        .map((email: string) => email.trim())
                    )
                  }
                >
                  <InfoItem
                    label={"Email CC,"}
                    value={ledgerDetail.emailcc ?? "-"}
                  />
                </Button>
              </Card>

              {/* Address Details */}
              <Typography variant="h5" className="font-medium mb-2">
                {"Address Details"}
              </Typography>
              <Card className="bg-gray-100 rounded-lg p-4 mb-4">
                <Button
                  onClick={() =>
                    handleMapPress("address", ledgerDetail.address)
                  }
                >
                  <InfoItem
                    label={"Address"}
                    value={ledgerDetail.address?.replace(/..\n/g, "\n") ?? "-"}
                  />
                </Button>
                <div className="flex justify-between">
                  <InfoItem
                    label={"Country"}
                    value={ledgerDetail.country ?? "-"}
                  />
                  <InfoItem
                    label={"State"}
                    value={ledgerDetail.state ?? "-"}
                    align="right"
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={() =>
                      handleMapPress("pincode", ledgerDetail.pinCode)
                    }
                  >
                    <InfoItem
                      label={"PinCode"}
                      value={ledgerDetail.pinCode ?? "-"}
                    />
                  </Button>
                  <Button
                    onClick={() => {
                      let url = ledgerDetail.website;
                      if (
                        url &&
                        !url.startsWith("http://") &&
                        !url.startsWith("https://")
                      ) {
                        url = "http://" + url;
                      }
                      if (url) window.open(url, "_blank");
                    }}
                  >
                    <InfoItem
                      label={"Website"}
                      value={ledgerDetail.website ?? "-"}
                      align="right"
                    />
                  </Button>
                </div>
              </Card>

              {/* GST Details */}
              <Typography variant="h5" className="font-medium mb-2">
                {"Gst Details"}
              </Typography>
              <Card className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between">
                  <InfoItem
                    label={"Gst Number"}
                    value={
                      ledgerDetail.ledgerGSTRegistrationDetails?.[0]?.gstin ||
                      "-"
                    }
                  />
                  <InfoItem
                    label={"State"}
                    value={
                      ledgerDetail.ledgerGSTRegistrationDetails?.[0]?.state ||
                      "-"
                    }
                    align="right"
                  />
                </div>
                <div className="flex justify-between">
                  <InfoItem
                    label={"Place Of Supply"}
                    value={
                      ledgerDetail.ledgerGSTRegistrationDetails?.[0]
                        ?.placeOfSupply || "-"
                    }
                  />
                  <InfoItem
                    label={"Gst Registration Type"}
                    value={ledgerDetail.gstRegistrationType ?? "-"}
                    align="right"
                  />
                </div>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  align?: "left" | "right";
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  align = "left",
}) => (
  <div className={`mb-2 ${align === "right" ? "text-right" : "text-left"}`}>
    <Typography variant="body2" className="text-gray-600">
      {label}
    </Typography>
    <Typography variant="body1" className="font-semibold text-green-600">
      {value}
    </Typography>
  </div>
);

export default CustomerDetailsScreen ;