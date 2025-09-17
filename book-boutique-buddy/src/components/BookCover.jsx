const BookCover = ({ title, className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-16 h-20",
    default: "w-full h-full",
    large: "w-80 h-96"
  }

  return (
    <div className={`book-cover-frame ${sizeClasses[size]} ${className}`}>
      <div className="book-cover-inner w-full h-full flex items-center justify-center p-4">
        <div className="book-cover-decoration"></div>
        <div className="relative z-10 text-center">
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center p-4">
            {/* Decorative border */}
            <div className="absolute inset-2 border border-amber-300 rounded-lg"></div>
            
            {/* Floral decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 opacity-60">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-pink-400">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div className="absolute top-3 right-3 w-8 h-8 opacity-60">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-pink-400">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div className="absolute bottom-3 left-3 w-8 h-8 opacity-60">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-pink-400">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div className="absolute bottom-3 right-3 w-8 h-8 opacity-60">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-pink-400">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22Z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Title area */}
            <div className="relative z-20 text-center max-w-full">
              {size !== "small" && (
                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                  {title || "Les Murmures du Temps"}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCover

