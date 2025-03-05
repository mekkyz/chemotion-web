'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';

const primaryNavLinks = [
  { href: '/#eln', label: 'ELN', ariaLabel: 'Navigate to ELN section' },
  { href: '/#labimotion', label: 'LabIMotion', ariaLabel: 'Navigate to LabIMotion section' },
  { href: '/#repository', label: 'Repository', ariaLabel: 'Navigate to Repository section' }
];

const secondaryNavLinks = [
  { href: '/about', label: 'Who we are', ariaLabel: 'Learn more about us' },
  { href: '/helpdesk', label: 'Helpdesk', ariaLabel: 'Navigate to Helpdesk' },
  {
    href: 'https://chemotion.net/docs',
    label: 'Docs',
    ariaLabel: 'Navigate to Chemotion documentation',
    external: true
  }
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SearchResults = ({ results, searchTerm, onItemClick }) => {
  if (results.length > 0) {
    return (
      <ul className="divide-y divide-neutral-200">
        {results.map((doc) => (
          <li key={doc.__id} className="hover:bg-neutral-100 dark:hover:bg-darkBackground">
            <Link
              href={`https://chemotion.net${doc.u}?_highlight=${encodeURIComponent(searchTerm)}#${slugify(doc.t)}`}
              onClick={onItemClick}
              className="block px-6 py-4"
              aria-label={`Navigate to ${doc.t}`}
              target="_blank"
              rel="noopener noreferrer">
              <h3 className="truncate font-semibold text-gray-900 dark:text-darkForeground">{doc.t}</h3>
              <p className="truncate text-sm text-gray-500 dark:text-darkForeground">{doc.u}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="px-6 py-4 text-center text-gray-500 dark:text-darkForeground">
      No results found for <span className="font-bold">{searchTerm}</span>.
    </div>
  );
};

const NavBar = () => {
  const { searchTerm, setSearchTerm, searchResults } = useSearch();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchVisible((prev) => !prev);
        if (isSearchVisible) {
          setSearchTerm('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchVisible, setSearchTerm]);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    setSearchTerm('');
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleBlur = () => {
    if (!isDropdownHovered) {
      setIsSearchVisible(false);
    }
  };

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const scrollToTop = (e) => {
    const isRootPath = window.location.pathname === '/';
    if (isRootPath && window.location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => history.replaceState({}, '', '/'), 300);
    } else if (isRootPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-[66px] items-center bg-[#eeeeee] py-[3px] text-base font-medium text-gray-700 shadow-md dark:border-b dark:border-darkForeground dark:bg-darkBackground dark:text-darkForeground"
        role="banner">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center">
            <div className="transition-opacity duration-300 ease-in-out hover:opacity-80">
              <Link
                href="/"
                onClick={scrollToTop}
                className="ml-4 mr-12 flex items-center text-lg font-semibold text-gray-800 dark:text-darkForeground"
                aria-label="Navigate to Chemotion homepage">
                <Image src="/images/open-c.png" alt="Chemotion Logo" className="mr-4" width={35} height={42} />
                Chemotion
              </Link>
            </div>
            <nav className="hidden space-x-8 custom-lg:flex" aria-label="Main navigation">
              {primaryNavLinks.map(({ href, label, ariaLabel }) => (
                <Link
                  key={href}
                  href={href}
                  className="group relative transition-colors duration-300 hover:text-gray-700"
                  aria-label={ariaLabel}>
                  {label}
                  <span className="absolute bottom-[-4px] left-1/2 h-[3px] w-0 transition-all duration-300 ease-in-out group-hover:left-0 group-hover:w-full">
                    <span className="block size-full bg-gray-500"></span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden space-x-8 custom-lg:flex">
              {secondaryNavLinks.map(({ href, label, ariaLabel, external }) => (
                <Link
                  key={href}
                  href={href}
                  className="group relative transition-colors duration-300 hover:text-gray-700"
                  aria-label={ariaLabel}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {label}
                  <span className="absolute bottom-[-4px] left-1/2 h-[3px] w-0 transition-all duration-300 ease-in-out group-hover:left-0 group-hover:w-full">
                    <span className="block size-full bg-gray-500"></span>
                  </span>
                </Link>
              ))}
            </nav>

            {/* desktop search */}
            <div className="relative hidden custom-lg:block">
              <div
                onClick={!isSearchVisible ? toggleSearch : undefined}
                onKeyDown={(e) => e.key === 'Enter' && !isSearchVisible && toggleSearch()}
                role="button"
                tabIndex={0}
                className={`ml-4 flex items-center justify-between rounded-full px-4 py-2 font-light duration-300 ease-in-out custom-lg:mr-4 ${
                  isSearchVisible
                    ? 'h-10 w-72 border-2 border-gray-500 bg-white text-gray-700 dark:border-darkForeground dark:bg-darkBackground dark:text-darkForeground'
                    : 'h-10 w-52 cursor-pointer border-2 border-neutral-50 bg-neutral-50 shadow-md hover:text-gray-700 dark:border-darkForeground dark:bg-darkBackground'
                }`}>
                {isSearchVisible ? (
                  <>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      onBlur={handleBlur}
                      autoFocus
                      placeholder="Search the docs"
                      className="w-full bg-transparent font-medium outline-none transition-opacity duration-300"
                    />
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="ml-auto text-gray-500 hover:text-gray-700 dark:text-darkForeground">
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="flex flex-row items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2 size-6 text-[#008ab8] dark:text-darkForeground">
                      <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mr-2 text-gray-700 dark:text-darkForeground">Search the docs</div>
                  </div>
                )}
              </div>
              {isSearchVisible && (searchResults.length > 0 || searchTerm.trim().length > 0) && (
                <div
                  className="absolute right-4 z-50 mt-3 max-h-[500px] w-[60vw] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-darkForeground dark:bg-darkBackground md:w-[600px]"
                  role="menu"
                  tabIndex={0}
                  onMouseEnter={() => setIsDropdownHovered(true)}
                  onMouseLeave={() => setIsDropdownHovered(false)}>
                  <SearchResults results={searchResults} searchTerm={searchTerm} />
                </div>
              )}
            </div>

            {/* mobile search button*/}
            <div className="custom-lg:hidden">
              <button
                onClick={toggleSearch}
                aria-label="Toggle search"
                className="ml-4 flex h-10 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-50 bg-neutral-50 px-4 py-2 font-light text-gray-800 shadow-md duration-300 ease-in-out hover:text-gray-700 dark:border-darkForeground dark:bg-darkBackground dark:text-darkForeground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 size-6 text-[#008ab8] dark:text-darkForeground">
                  <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-gray-700 dark:text-darkForeground">Docs</div>
              </button>
            </div>

            {/* mobile menu button */}
            <button
              onClick={toggleMenu}
              className="relative z-50 p-4 focus:outline-none custom-lg:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}>
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition duration-300 dark:bg-darkForeground ${
                    isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition duration-300 dark:bg-darkForeground ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition duration-300 dark:bg-darkForeground ${
                    isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* mobile search overlay */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-darkBackground custom-lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-darkForeground">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                autoFocus
                placeholder="Search the docs"
                className="grow rounded-md border border-gray-300 p-2 focus:outline-none dark:border-darkForeground"
              />
              <button onClick={toggleSearch} aria-label="Close search" className="ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grow overflow-auto p-4">
              {searchResults.length > 0 ? (
                <SearchResults results={searchResults} searchTerm={searchTerm} onItemClick={toggleSearch} />
              ) : searchTerm.trim().length > 0 ? (
                <div className="mt-4 text-center text-gray-500">
                  No results found for <span className="font-bold">{searchTerm}</span>.
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobileMenuBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 custom-lg:hidden"
            onClick={toggleMenu}>
            <motion.div
              key="mobileMenuDrawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-2/3 bg-white p-8 dark:bg-darkBackground"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-8 flex justify-end">
                <button onClick={toggleMenu} aria-label="Close menu">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-6 text-gray-700 dark:text-darkForeground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col space-y-8">
                {primaryNavLinks.map(({ href, label, ariaLabel }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMenu}
                    className="text-xl font-medium text-gray-800 dark:text-darkForeground"
                    aria-label={ariaLabel}>
                    {label}
                  </Link>
                ))}
                <div className="w-full border-t border-gray-300 dark:border-darkForeground"></div>
                {secondaryNavLinks.map(({ href, label, ariaLabel, external }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMenu}
                    className="text-xl font-medium text-gray-800 dark:text-darkForeground"
                    aria-label={ariaLabel}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
