export const useCheckScreenType = () => {
    const screenWidth = window.innerWidth;

    return {
        isMobile: screenWidth <= 400,
        isTab: screenWidth >= 400 && screenWidth <= 767,
        isDesktop: screenWidth > 767
    };
};
