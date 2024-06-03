import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MovieProviderService } from 'src/app/providers/movie/movie-provider.service';
import { ModalController } from '@ionic/angular';
import { MovieModalComponent } from '../modal-component/modal-component.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

register();

@Component({
  selector: 'app-last-series-component',
  templateUrl: './last-series-component.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./last-series-component.component.scss'],
})
export class LastSeriesComponentComponent implements OnInit, AfterViewInit {

  movies: any[] = [];
  currentPage: number = 1;
  language: string = 'pt-BR'; // Idioma desejado para a sinopse

  constructor(private movieService: MovieProviderService, private modalController: ModalController) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 50); // Espera 1 segundo antes de chamar a função initSwiper
  }

  private initSwiper() {
    new Swiper('.mySwiper');
  }
  
  private loadMovies() {
    this.movieService.getTopSerie().subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          this.movies.push(...data); // Adiciona os resultados ao array movies
        }
      },
      (error) => {
        console.error('Error loading series:', error);
      }
    );
  }
  

  async openMovieModal(movie: any) {
    const movieData = await this.movieService.getSerieById(movie.id, this.language).toPromise();
    const genres = movieData.genres.map((genre: any) => genre.name).join(', ');
    const modal = await this.modalController.create({
      component: MovieModalComponent,
      componentProps: {
        title: movie.title,
        synopsis: movieData.overview,
        genres: genres,
        posterPath: movie.poster_path,
        popularity: movieData.popularity,
        voteAverage: movieData.vote_average,
        voteCount: movieData.vote_count,
        releaseDate: movieData.release_date
      }
    });
    return await modal.present();
  }
}
