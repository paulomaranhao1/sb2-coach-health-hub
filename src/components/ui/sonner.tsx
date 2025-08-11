
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"

      position="top-center"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-xl !bg-white !bg-opacity-100 !backdrop-blur-none border-2",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-blue-500 group-[.toast]:text-white hover:group-[.toast]:bg-blue-600",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 hover:group-[.toast]:bg-gray-200",
          closeButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 hover:group-[.toast]:bg-gray-200",
        },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '2px solid #e5e7eb',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
