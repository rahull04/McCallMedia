import {useState} from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
  };
};
