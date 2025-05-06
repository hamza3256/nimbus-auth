import Image from "next/image";

export function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="https://res.cloudinary.com/dn20h4mis/image/upload/e_enhance/q_auto/f_auto/background_zhum8q"
        alt="Background"
        fill
        style={{ objectFit: "cover", objectPosition: "78% center" }}
        priority
      />
      {/* Container for Nimbus */}
      <div className="absolute inset-0" style={{ top: "10%" }}>
        {/* Nimbus */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            animation: "nimbusMove1 22s linear infinite",
            height: "auto",
            width: "auto",
          }}
        >
          <div
            className="sm:h-[50px] sm:w-[50px] h-[32px] w-[32px]"
            style={{
              backgroundImage: "url('/nimbus.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.8,
              animation: "nimbusBob 3.5s ease-in-out infinite",
              filter: "blur(0.3px)",
              transform: "translateZ(0)", // Force hardware acceleration
              willChange: "transform", // Optimize for animations
            }}
          />
        </div>
      </div>
    </div>
  );
}
