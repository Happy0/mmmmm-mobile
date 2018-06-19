/**
 * MMMMM is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {FeedId} from 'ssb-typescript';
import {Stream} from 'xstream';
import {Reducer} from 'cycle-onionify';
import {SSBSource} from '../../drivers/ssb';
import {shortFeedId} from '../../../ssb/from-ssb';

export type State = {
  selfFeedId: FeedId;
  name?: string;
};

export default function model(
  state$: Stream<State>,
  ssbSource: SSBSource,
): Stream<Reducer<State>> {
  const initAboutReducer$ = state$
    .filter(state => !!state.selfFeedId)
    .take(1)
    .map(state => ssbSource.profileAbout$(state.selfFeedId))
    .flatten()
    .map(
      about =>
        function initAboutReducer(prev: State): State {
          if (about.name === prev.selfFeedId) {
            return prev;
          } else if (about.name === shortFeedId(prev.selfFeedId)) {
            return prev;
          } else {
            return {selfFeedId: prev.selfFeedId, name: about.name};
          }
        },
    );

  return initAboutReducer$;
}
