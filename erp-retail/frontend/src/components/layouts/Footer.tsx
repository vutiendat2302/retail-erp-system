import React, {useState} from "react"

export const Footer = () => {
  return (
    <footer className="border-opacity-80 header ">
        <div className="container mx-auto px-4 py-2 max-w-screen-2xl">
          <div className="flex flex-col md:flex-row justify-between center items-center">

            <p className="flex text-sm font-weight-light font-inter mt-3">
              © 2025 WareHouse Pro. Tất cả quyền được bảo lưu.
            </p>

            <div className = 'flex items-center space-x-1'>
              <a href="support" className="flex text-sm font-inter font-weight-light font-color !no-underline">
                | Hỗ trợ |
              </a>
              <a href="terms-of-service" className="flex text-sm font-inter font-weight-light font-color !no-underline">
                Điều khoản |
              </a>
              <a href="status" className="flex text-sm font-inter font-weight-light font-color !no-underline">
                Trạng thái |
              </a>

              <a href="feedback" className="flex text-sm font-inter font-weight-light font-color !no-underline">
                Phản hồi |
              </a>
            </div>
          </div>
        </div>
    </footer>
  );
}