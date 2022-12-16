import React, { ReactElement, Component, useEffect, useState } from "react";
import {PB} from "./PieceTypes";


const move = () => {
  return {x:2, y:2, constraint: PB.omnidirectional};
};

const King: React.FC = (p): ReactElement => {

  const moveSelf = move;

  return (
    <div className= "king specific">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" preserveAspectRatio="none">
        <g stroke ={p.outline} fill={p.color} fill="none" >
          <path stroke={p.outline} fill={p.color} d="M22.5 11.63V6M20 8h5"/>
          <path stroke={p.outline} fill={p.color} d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/>
          <path stroke={p.outline} fill={p.color} d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/>
          <path stroke={p.outline} fill={p.color} d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/>
        </g>
      </svg>
    </div>
  );
};

export default King;

King.displayName = "King";

King.move = move;
