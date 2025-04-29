"use client";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Static background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Container for Nimbus */}
      <div className="absolute inset-0" style={{ top: "10%" }}>
        {/* First Nimbus */}
        <div
          className="absolute"
          style={{
            backgroundImage: "url('/nimbus.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.8,
            height: "50px",
            width: "50px",
            animation: "moveNimbus1 22s linear infinite",
            filter: "blur(0.3px)",
            transform: "translateZ(0)", // Force hardware acceleration
            willChange: "transform", // Optimize for animations
          }}
        />
        
        {/* Second Nimbus */}
        <div
          className="absolute"
          style={{
            backgroundImage: "url('/nimbus.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.8,
            height: "50px",
            width: "50px",
            animation: "moveNimbus2 22s linear infinite",
            filter: "blur(0.3px)",
            transform: "translateZ(0)", // Force hardware acceleration
            willChange: "transform", // Optimize for animations
          }}
        />
      </div>
    </div>
  );
} 