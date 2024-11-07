import React from "react";
import { Link } from "react-router-dom";

export const CardIcon = ({ logo, colorbg, coloricon, title, subtitle, link }) => {
  return (
    <Link to={link}>
      <div
        className={`${colorbg} h-32 rounded-md flex flex-col items-center justify-center mb-4 ${
          subtitle ? "gap-3" : "gap-2"
        }`}
      >
        {/* Conditional Layout: */}
        {/* If subtitle is provided, use the layout with the icon on the left */}
        {subtitle ? (
          // Icon on the left, Title on top of Subtitle, both text aligned to the left
          <div className="flex items-center justify-start gap-4 w-full">
            {/* Icon */}
            <div
              className={`w-16 h-16 ${coloricon} rounded-full flex items-center justify-center`}
            >
              <img src={logo} alt={title} className="w-10 h-10" />
            </div>

            {/* Text content (Title & Subtitle) */}
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-lg">{title}</p>
              <p className="text-sm">{subtitle}</p>
            </div>
          </div>
        ) : (
          // Default Layout: Icon above the Title
          <div className="flex flex-col items-center justify-center gap-2">
            {/* Icon */}
            <div
              className={`w-16 h-16 ${coloricon} rounded-full flex items-center justify-center`}
            >
              <img src={logo} alt={title} className="w-10 h-10" />
            </div>

            {/* Title */}
            <p className="font-semibold text-lg">{title}</p>
          </div>
        )}
      </div>
    </Link>
  );
};
