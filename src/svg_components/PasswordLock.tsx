import * as React from 'react';
import { SVGProps } from 'react';

function SvgPasswordLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <rect
        x={6}
        y={11}
        width={12}
        height={10}
        rx={2}
        stroke={props.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11V7a4 4 0 1 1 8 0v4"
        stroke={props.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={12} cy={15} r={1.5} fill={props.stroke} />
    </svg>
  );
}

export default SvgPasswordLock;
