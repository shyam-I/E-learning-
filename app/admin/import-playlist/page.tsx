'use client'

import { useState } from 'react'

export default function ImportPlaylistPage() {
  const [courseId, setCourseId] = useState('')
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    if (!courseId || !playlistUrl) {
      alert('Please enter Course ID and Playlist URL')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        '/api/import-playlist',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            courseId,
            playlistUrl,
          }),
        }
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Import failed'
        )
      }

      alert(
        `Successfully imported ${result.count} lessons`
      )

      setCourseId('')
      setPlaylistUrl('')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="border rounded-xl p-8 space-y-6">

        <h1 className="text-3xl font-bold">
          Import YouTube Playlist
        </h1>

        <input
          type="text"
          value={courseId}
          onChange={(e) =>
            setCourseId(
              e.target.value
            )
          }
          placeholder="Course ID"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          value={playlistUrl}
          onChange={(e) =>
            setPlaylistUrl(
              e.target.value
            )
          }
          placeholder="https://youtube.com/playlist?list=..."
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={handleImport}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {loading
            ? 'Importing...'
            : 'Import Playlist'}
        </button>

      </div>
    </div>
  )
}