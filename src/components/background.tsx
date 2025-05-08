// Removed Image import as it might not be needed if Nimbus is also removed for now

export function Background() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline // Essential for iOS autoplay
        className="absolute top-1/2 left-[25%] md:left-1/2 min-w-[150%] md:min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2"
        poster="https://res.cloudinary.com/dn20h4mis/image/upload/e_enhance/q_auto/f_auto/background_zhum8q" // Fallback image
      >
        <source
          src="https://res.cloudinary.com/dn20h4mis/video/upload/v1746728104/background_rzsthe.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* 
        If you want the Nimbus animation back, its container would need 
        a z-index higher than the video's parent div (e.g., -z-10) 
        and careful positioning. For now, it's removed for simplicity.
      */}

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
