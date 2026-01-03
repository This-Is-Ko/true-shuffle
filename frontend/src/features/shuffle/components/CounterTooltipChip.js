import React, { useState } from "react";
import { Chip, Tooltip, ClickAwayListener, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { formatNumberWithSpaces } from "../../../utils/NumberFormatter";

const CounterTooltipChip = ({ icon, label, tooltipTitle, onClick }) => {
    const [openTooltip, setOpenTooltip] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's a mobile screen

    const handleTooltipToggle = () => {
        if (isMobile) {
            setOpenTooltip((prev) => !prev);
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setOpenTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setOpenTooltip(false);
        }
    };

    const handleTouchStart = () => {
        if (isMobile) {
            setOpenTooltip(true);
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) {
            setOpenTooltip(false);
        }
    };

    return (
        <ClickAwayListener onClickAway={() => setOpenTooltip(false)}>
            <Tooltip
                title={tooltipTitle}
                arrow
                open={isMobile ? openTooltip : undefined}
                onClose={() => setOpenTooltip(false)}
                disableInteractive
            >
                <Chip
                    icon={icon}
                    label={`${formatNumberWithSpaces(label)}`}
                    sx={{ backgroundColor: "#232323", color: "#FFF" }}
                    onClick={handleTooltipToggle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />
            </Tooltip>
        </ClickAwayListener>
    );
};

export default CounterTooltipChip;
