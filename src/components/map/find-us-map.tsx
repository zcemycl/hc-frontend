const FindUsMap = () => {
  return (
    <>
      {/* https://www.maps.ie/create-google-map/ */}
      <iframe
        width="100%"
        height="100%"
        title="map"
        className="absolute inset-0"
        style={{
          filter: "grayscale(0) contrast(1) opacity(0.8)",
          border: 0,
          overflow: "hidden",
          margin: 0,
        }}
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=London+(RXScope)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      ></iframe>
    </>
  );
};

export { FindUsMap };
