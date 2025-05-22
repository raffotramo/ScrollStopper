import scrollStopLogo from "@assets/Progetto senza titolo (4).png";

const Header = () => {
  return (
    <div className="flex justify-center py-6">
      <img 
        src={scrollStopLogo} 
        alt="ScrollStop" 
        className="h-16 w-auto"
      />
    </div>
  );
};

export default Header;