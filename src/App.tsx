import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faPlay, faSync } from '@fortawesome/free-solid-svg-icons'
import { faSpotify, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import env from "react-dotenv";

const options:AxiosRequestConfig<Array<string>> = {
  method: 'GET',
  url: 'https://kareoke.p.rapidapi.com/v1/song/random',
  headers: {
    'x-rapidapi-host': env.API_URL,
    'x-rapidapi-key': env.API_ACCESS_TOKEN
  }
};

export default function App() {
  const [song, setSong] = React.useState<Song | null>(null);

  interface Song {
    spotify: {
      artists: [{
        id: string,
        name: string,
        uri: string,
        url: string
      }]
      id: string,
      length: number,
      title: string,
      url: string,
    };
    youtube: {
      channels: [{
        id: string,
        name: string
      }],
      image: string,
      title: string,
      url: string
    };
  };

  function fetchData() {
    axios.request(options).then((response) => {
      setSong(response.data);
    });
  }

  React.useEffect(() => {
    fetchData()
  }, []);

  function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + seconds;
  }

  const style = {
    backgroundImage: `url("${song?.youtube.image}")`
  }

  const reload = () => { fetchData() }

  return (song && song.spotify ?
    <div>
      <header className="absolute top-0 p-1">
        <h1 className="text-white">Random Song Generator
          <span className="text-zinc-700 text-2xl relative top-1 hover:text-zinc-400">- brings you to unexpected sensations -</span>
        </h1>
      </header>
      <div className="flex flex-col justify-center content-center h-screen">
        <div className="flex flex-wrap justify-center content-center">
          {/* spotify */}
          <a href={song.spotify.url}>
            <div className="spotify p-4 rounded-l-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 relative after:content-[''] after:absolute after:inset-1 after:bg-zinc-900 after:rounded-l-2xl after:z-10">
              <h1 className="uppercase text-sm relative z-20 text-white">
                <FontAwesomeIcon icon={faSpotify} size="lg" className="mr-1 text-white"></FontAwesomeIcon>
                <span className="relative z-20">{song.spotify.artists[0].name}</span>
              </h1>
              <p className="text-3xl link relative z-20 text-white">
                {song.spotify.title}
              </p>
              <div className="flex justify-between content-between text-white">
                <span className="relative z-20">{millisToMinutesAndSeconds(song.spotify.length)}</span>
                <FontAwesomeIcon className="z-20 mt-1 text-white" icon={faPlay} size="sm"></FontAwesomeIcon>
              </div>
            </div>
          </a>
          {/* youtube */}
          <a href={song.youtube.url} className="relative">
            <div className="youtube h-full p-4 pt-4 rounded-r-2xl relative bg-repeat after:content-[''] after:rounded-r-2xl after:opacity-10 after:absolute after:top-0 after:left-0 after:w-full after:h-full before:content-[''] before:absolute before:inset-1 before:bg-zinc-900 before:rounded-r-xl" style={style}>
              <div className="relative z-10">
                <FontAwesomeIcon className="ml-1 z-10 text-white hover:animate-pulse" icon={faYoutube} size="lg"></FontAwesomeIcon>
              </div>
              <p className="text-3xl underline decoration-wavy link relative z-10 text-white">{song.youtube.title}</p>
            </div>
          </a>
        </div>
        {/* reload button */}
        <div className="flex justify-center">
          <button onClick={reload} className="mt-16 py-3 px-6 bg-zinc-800 rounded-md reload-button">
            <FontAwesomeIcon className="ml-1 z-10 text-zinc-600 hover:animate-spin" icon={faSync} size="lg"></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <footer className="opacity-0">
        <FontAwesomeIcon className="ml-1 z-10 absolute bottom-0 text-white" icon={faGithub} size="lg"></FontAwesomeIcon>
      </footer>
    </div> :
      <div className="flex flex-wrap justify-center h-screen flex-wrap content-center">
        <FontAwesomeIcon icon={faSpinner} size="3x" className="text-white"></FontAwesomeIcon>
      </div>
  );
}
