import { formattedData as Manga } from '../../types/SeasonAnime';
import { WelcomeBar } from "../../components/WelcomeBar";
import { AnimesPageContainer } from '../Animes/styles';
import { getRandomMangas } from '../../api/jikanApi';
import { Loading } from '../../components/Loading';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Carousel from 'nuka-carousel';

export function MangasPage() {
  const [randomMangas, setRandomMangas]: any = useState()
  const redirect = useNavigate()

  useEffect(() => {
    getRandomMangas(setRandomMangas)
  }, [])

  if (!randomMangas)
    return (
      <Loading />
    )


  return (
    <AnimesPageContainer>
      <WelcomeBar
        gifType="think"
      />
      <h1>Mangás</h1>

      <div className='carousel-wrapper'>
        <Carousel slidesToShow={7} style={{ overflowX: 'clip', userSelect: 'none' }}>
          {randomMangas.map((randomManga: Manga) => (
            <img
              key={randomManga.malId}
              src={randomManga.image}
              alt={`${randomManga.name} Cover`}
              width={180}
              height={280}
              onDoubleClick={() => redirect(`/manga/${randomManga.malId}`)}
            />
          ))}
        </Carousel>
      </div>
    </AnimesPageContainer>
  )
}