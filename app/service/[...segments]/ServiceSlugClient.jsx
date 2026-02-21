'use client'
import ConsultNowModal from "@/app/components/ConsultNowModal";
import React, { useState } from "react";
import TalkToExpertCard from "../TalkToExpertCard";

const ServiceSlugClient = () => {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <TalkToExpertCard onClick={() => setConsultOpen(true)} />
      <ConsultNowModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        title="Consult Now"
      />
    </>
  );
};

export default ServiceSlugClient;
