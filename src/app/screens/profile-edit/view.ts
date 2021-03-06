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

import xs, {Stream} from 'xstream';
import {h} from '@cycle/react';
import {View, Text, TextInput, Image} from 'react-native';
import Button from '../../components/Button';
import {Palette} from '../../global-styles/palette';
import {State} from './model';
import {styles} from './styles';
import {ReactElement} from 'react';

export default function view(
  state$: Stream<State>,
  topBarElem$: Stream<ReactElement<any>>,
) {
  return xs.combine(state$, topBarElem$).map(([state, topBarElem]) => {
    const defaultName =
      !state.about.name ||
      (state.about.name.length > 40 && state.about.name[0] === '@')
        ? ''
        : state.about.name;

    return h(View, {style: styles.container}, [
      topBarElem,

      h(View, {style: styles.cover}),

      h(
        View,
        {style: styles.avatarBackground},
        [
          !!state.about.imageUrl
            ? h(Image, {
                style: styles.avatar,
                source: {uri: state.about.imageUrl},
              })
            : null,
        ] as Array<any>,
      ),

      h(Button, {
        sel: 'save',
        style: styles.save,
        strong: true,
        text: 'SAVE',
        accessible: true,
        accessibilityLabel: 'Save Profile Button',
      }),

      h(View, {style: styles.fields}, [
        h(Text, {style: styles.label}, 'Name'),
        h(TextInput, {
          sel: 'name',
          multiline: false,
          autoFocus: true,
          defaultValue: defaultName,
          underlineColorAndroid: Palette.brand.background,
          accessible: true,
          accessibilityLabel: 'Name Text Input',
          style: styles.textInput,
        }),

        h(Text, {style: styles.label}, 'Bio'),
        h(TextInput, {
          sel: 'description',
          multiline: true,
          autoFocus: false,
          numberOfLines: 1,
          defaultValue: state.about.description || '',
          underlineColorAndroid: Palette.brand.background,
          accessible: true,
          accessibilityLabel: 'Description Text Input',
          style: styles.textInput,
        }),
      ]),
    ]);
  });
}
