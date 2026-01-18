import { useState } from "react";
import { Box, Container, Card, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import NewsHeader from "../layouts/NewsHeader";
import { BannerThemes } from "../../data/bannerThemes";
import FitnessCard from "./FitnessCard";

export default function Fitness() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { authType } = useAuth();
  const theme = BannerThemes[authType] || BannerThemes.default;

  return (
    <>
      {/* FIXED HEADER */}
      <NewsHeader
        onHeightChange={(h) => setHeaderHeight(h)}
        activeCategory="professional"
      />

      {/* MAIN PAGE CONTENT */}
      <FitnessCard />
    </>
  );
}
