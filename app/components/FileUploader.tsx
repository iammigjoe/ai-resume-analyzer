import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
    selectedFile: File | null;
}

const FileUploader = ({ onFileSelect, selectedFile }: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        if (onFileSelect) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
        // On enlève noClick: true pour que toute la zone soit active
        // Cela évite les "clics dans le vide" qui ne font rien
    })

    return (
        <div className="w-full gradient-border">
            {/* On ajoute une classe pour montrer que c'est cliquable */}
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
                {/* IMPORTANT : on ajoute l'ID 'uploader' pour que le Label du formulaire parent fonctionne.
                   Cela résout souvent les problèmes où "rien ne se passe".
                */}
                <input {...getInputProps({ id: 'uploader' })} />

                <div className="space-y-4 w-full">
                    {selectedFile ? (
                        // --- CAS : FICHIER SÉLECTIONNÉ ---
                        <div
                            className="uploader-selected-file border p-4 rounded-lg bg-white shadow-sm flex items-center justify-between cursor-default"
                            onClick={(e) => e.stopPropagation()} // Empêche de réouvrir la fenêtre si on clique sur la carte du fichier
                        >
                            <div className="flex items-center space-x-3">
                                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 cursor-pointer hover:bg-gray-200 rounded-full transition"
                                onClick={(e) => {
                                    e.stopPropagation(); // Très important : empêche d'ouvrir la fenêtre quand on veut juste supprimer
                                    onFileSelect?.(null);
                                }}
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        // --- CAS : AUCUN FICHIER ---
                        <div className="flex flex-col items-center">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20 opacity-60" />
                            </div>
                            <p className="text-lg text-gray-500 mb-4">
                                {isDragActive ? (
                                    <span className="text-blue-500 font-semibold">Déposez le fichier ici...</span>
                                ) : (
                                    <>Glissez votre CV ou cliquez ici</>
                                )}
                            </p>

                            {/* Ce bouton est visuel, le clic est géré par la div parente (getRootProps) */}
                            <button
                                type="button"
                                className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:opacity-80 transition pointer-events-none"
                            >
                                Sélectionner un fichier
                            </button>

                            <p className="text-sm text-gray-400 mt-2">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader