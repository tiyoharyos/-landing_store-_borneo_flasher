import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import NavbarHome from "@/components/NavbarHome";
import { searchProducts, type Product } from "@/data/mockData";
import searchIllustration from "@/assets/img/search-illustration.png";
import searchDefault from "@/assets/img/search-default.png";
import notFoundImg from "@/assets/img/not-found.png";

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [keySearch, setKeySearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [dataShow, setDataShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runSearch = (page: number) => {
    const query = searchTerm.trim();
    const result = searchProducts(query, page);
    setKeySearch(query);
    setProducts(result.results);
    setTotalItems(result.total_records);
    setTotalPages(result.total_pages);
    setDataShow(true);
    setCurrentPage(page);
    setInputPage(page);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const cariProduk = () => {
    const query = searchTerm.trim();
    if (!query) {
      resetSearch();
      return;
    }
    if (query.length < 3) {
      setErrorMessage("Kata kunci minimal 3 karakter!");
      return;
    }
    setErrorMessage("");
    runSearch(1);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setProducts([]);
    setDataShow(false);
    setErrorMessage("");
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) runSearch(page);
  };

  return (
    <div className="search">
      <NavbarHome />

      <section className="headerSearch">
        <div className="container relative">
          <div className="contentSearch">
            <div className="img">
              <img src={searchIllustration} alt="" />
            </div>
            <div className="formSearch">
              <p className="titleSearch">
                Temukan Sparepart atau Tools yang Anda cari.
              </p>
              {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
              <div className="div">
                <div className="searchbar">
                  <div className="searchbar-wrapper">
                    <div className="searchbar-left">
                      <span className="search-icon">
                        <Icon icon="mdi:magnify" width={22} />
                      </span>
                    </div>
                    <div className="searchbar-center">
                      <input
                        ref={inputRef}
                        type="text"
                        className="searchbar-input"
                        autoComplete="off"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && cariProduk()}
                        placeholder="Ketik Nama Produk atau Tipe Handphone"
                      />
                    </div>
                    <div className="searchbar-right">
                      <button onClick={cariProduk} className="btn-search">
                        Cari
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="btn-show-small">
                <button onClick={cariProduk} className="btn-search">
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="resultSearch" ref={resultRef}>
        <div className="container">
          {dataShow ? (
            <div className="contentResult">
              <div className="flex justify-center">
                <div className="w-full md:w-8/12">
                  <p className="titleSearch">
                    Menampilkan hasil untuk :{" "}
                    <span className="keySearch">{keySearch}</span> -{" "}
                    {totalItems} produk ditemukan
                  </p>

                  {products.length ? (
                    <div className="contentTable">
                      <table>
                        <thead>
                          <tr>
                            <td>Produk</td>
                            <td>Stok</td>
                            <td>Harga</td>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id}>
                              <td>{p.nama_produk}</td>
                              <td>
                                {p.stock !== 0 ? (
                                  <span className="badge badge-stock">{p.stock}</span>
                                ) : (
                                  <span className="badge badge-out">{p.stock}</span>
                                )}
                              </td>
                              <td>{currency(p.harga_khusus)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pagination-box">
                        <span className="info">
                          Halaman
                          <input
                            type="number"
                            value={inputPage}
                            min={1}
                            max={totalPages}
                            onChange={(e) => setInputPage(Number(e.target.value))}
                            onBlur={() => changePage(inputPage)}
                          />
                          dari {totalPages}
                        </span>
                        <div>
                          {currentPage > 1 && (
                            <button
                              className="btn-page prev"
                              onClick={() => changePage(currentPage - 1)}
                            >
                              <Icon icon="mdi:arrow-left" />
                            </button>
                          )}
                          {currentPage < totalPages && (
                            <button
                              className="btn-page next"
                              onClick={() => changePage(currentPage + 1)}
                            >
                              Next <Icon icon="mdi:arrow-right" className="inline ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="not-found">
                      <div className="flex justify-center mt-3">
                        <div className="w-full md:w-6/12">
                          <img src={notFoundImg} alt="" className="mx-auto" />
                          <p className="titleNotfound">Oops.. Tidak Ditemukan</p>
                          <p className="descNotFound">
                            Jangan khawatir, ini kadang terjadi. Coba masukkan kata
                            kunci pencarian lain.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="btnClear">
                <button onClick={resetSearch}>Hapus Pencarian</button>
              </div>
            </div>
          ) : (
            <div className="imgDefaultSearch">
              <img src={searchDefault} alt="" className="mx-auto" />
              <div className="flex justify-center">
                <div className="w-full md:w-5/12">
                  <p className="content-text">
                    Gunakan pencarian untuk menemukan produk yang Anda cari di{" "}
                    <span>GadgetShop - Pusat Sparepart Handphone & Tool Service.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
