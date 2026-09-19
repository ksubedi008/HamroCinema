import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    // Save the original title
    const originalTitle = document.title;
    
    // Set the new title
    document.title = title;

    // Cleanup to restore original title if the component unmounts
    // (Optional, but good practice. We can also just let the new page set its own title)
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
