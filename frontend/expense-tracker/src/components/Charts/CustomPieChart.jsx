import React, { useRef, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors,
  showTextAnchor,
}) => {
  // Responsive radii based on container size
  const [size, setSize] = useState(0);
  const chartRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const min = Math.min(
          chartRef.current.offsetWidth,
          chartRef.current.offsetHeight
        );
        setSize(min);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate radii
  const outerRadius = size ? Math.max(50, size / 2.3) : 100;
  const innerRadius = size ? Math.max(30, size / 3.2) : 70;

  return (
    <div className="w-full max-w-[400px] mx-auto bg-gray-100 rounded-2xl shadow-md flex flex-col items-center p-4 sm:p-6">
      <div className="w-full text-left mb-2 sm:mb-4">
        <span className="text-lg sm:text-xl font-semibold text-black">Financial Overview</span>
      </div>
      <div
        ref={chartRef}
        className="w-full flex justify-center items-center"
        style={{ maxWidth: 320, aspectRatio: 1, minHeight: 0 }}
      >
        <ResponsiveContainer width="100%" aspect={1}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showTextAnchor && (
        <div className="w-full flex flex-col items-center justify-center mt-4">
          <span className="block text-center text-base sm:text-lg font-semibold text-black">{label}</span>
          <span className="block text-center text-xl sm:text-2xl font-bold text-black">{totalAmount}</span>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
