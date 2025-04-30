import Card from "../../Shared/Card";

const Gadget = ({ gadgets }) => {
  // Ensure gadgets is always an array before using map
  if (!Array.isArray(gadgets)) {
    return <p>No gadgets available.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gadgets.length === 0 ? (
        <p>No gadgets found based on your search criteria.</p>
      ) : (
        gadgets.map((gadget) => <Card gadget={gadget} key={gadget._id} />)
      )}
    </div>
  );
};

export default Gadget;
