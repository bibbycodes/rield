import React from 'react';

export default function LoadingButton({
                                        children,
                                        className,
                                        loading,
                                        ...args
                                      }: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { loading: boolean }) {

  return <>
    {!loading && <>{children}</>}
    {loading &&
        <button type="button"
                className={`${className} inline-flex items-center
                justify-center
                text-sm font-semibold leading-6 text-white
                h-full text-tPrimary border-[#6F47EF] p-3 rounded-lg border-2
                uppercase disabled:text-tSecondary disabled:border-tSecondary
                transition duration-150 ease-in-out shadow cursor-not-allowed`}
                disabled>
            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            Loading...
        </button>
    }
  </>
}
