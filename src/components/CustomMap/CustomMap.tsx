import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import axios from "axios";
import "./CustomMap.css";
// import House from "./house.svg";
import Stadium from "./walesStadium.svg";

// const sectors = ["Hall", "Room1", "Room2", "WC", "Kitchen"];
const sectors = [
  "M29_Premium_Ticket",
  "M30_Premium_Ticket_1_",
  "M31_Premium_Ticket_1_",
];

const file = Stadium;

const ACTIVE_CLASS_NAME = "active-sector";
const CHECKED_CLASS_NAME = "checked-sector";
const HOVERED_CLASS_NAME = "hovered-sector";

const CustomMap = () => {
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const [stringSvg, setStringSvg] = useState<string | undefined>(undefined);
  const [hoveredSector, setHoveredSector] = useState<string | undefined>(
    undefined
  );
  const [activeSector, setActiveSector] = useState<string | undefined>(
    undefined
  );

  const getFile = async () => {
    const result = await axios.get(file);
    setStringSvg(result.data);
  };

  useEffect(() => {
    getFile();
  }, []);

  useLayoutEffect(() => {
    if (!stringSvg) {
      return;
    }

    sectors.forEach((sectorId) => {
      const element = document.getElementById(sectorId);
      if (element) {
        element.classList.add(ACTIVE_CLASS_NAME);
        element.dataset.active = "true";
      }
    });
  }, [stringSvg, mapWrapperRef]);

  useLayoutEffect(() => {
    if (hoveredSector) {
      const element = document.getElementById(hoveredSector);

      element?.classList.add(HOVERED_CLASS_NAME);

      return () => {
        element?.classList.remove(HOVERED_CLASS_NAME);
      };
    }
  }, [hoveredSector]);

  useLayoutEffect(() => {
    if (activeSector) {
      const element = document.getElementById(activeSector);

      element?.classList.add(CHECKED_CLASS_NAME);

      return () => {
        element?.classList.remove(CHECKED_CLASS_NAME);
      };
    }
  }, [activeSector]);

  const onMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      (event.target instanceof SVGPathElement ||
        event.target instanceof SVGRectElement) &&
      event.target?.dataset.active === "true"
    ) {
      setHoveredSector(event.target.id);
    } else {
      setHoveredSector(undefined);
    }
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      (event.target instanceof SVGPathElement ||
        event.target instanceof SVGRectElement) &&
      event.target?.dataset.active === "true"
    ) {
      setActiveSector(event.target.id);
    }
  };

  return (
    <>
      <h2>Active section: {activeSector}</h2>
      <h2>Hovered section: {hoveredSector}</h2>
      <div
        ref={mapWrapperRef}
        className="custom-map-root"
        dangerouslySetInnerHTML={stringSvg ? { __html: stringSvg } : undefined}
        onMouseOver={onMouseOver}
        onClick={onClick}
      />
    </>
  );
};

export default CustomMap;
