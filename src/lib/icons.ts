/**
 * Iconify icon registry.
 *
 * Every icon used on the site is bundled locally (from the `@iconify-icons/solar`
 * icon-data package) and registered before render, so
 * `<iconify-icon icon="solar:..." />` resolves instantly with no runtime
 * round-trip to the Iconify API.
 */
import { addIcon } from 'iconify-icon'

import altArrowDownLinear from '@iconify-icons/solar/alt-arrow-down-linear'
import arrowLeftLinear from '@iconify-icons/solar/arrow-left-linear'
import arrowRightLinear from '@iconify-icons/solar/arrow-right-linear'
import bedLinear from '@iconify-icons/solar/bed-linear'
import chatRoundLinear from '@iconify-icons/solar/chat-round-linear'
import cityLinear from '@iconify-icons/solar/city-linear'
import clockCircleLinear from '@iconify-icons/solar/clock-circle-linear'
import closeCircleLinear from '@iconify-icons/solar/close-circle-linear'
import cupStarLinear from '@iconify-icons/solar/cup-star-linear'
import galleryLinear from '@iconify-icons/solar/gallery-linear'
import hamburgerMenuLinear from '@iconify-icons/solar/hamburger-menu-linear'
import leafLinear from '@iconify-icons/solar/leaf-linear'
import letterLinear from '@iconify-icons/solar/letter-linear'
import lockKeyholeLinear from '@iconify-icons/solar/lock-keyhole-linear'
import mapPointLinear from '@iconify-icons/solar/map-point-linear'
import maximizeSquareLinear from '@iconify-icons/solar/maximize-square-linear'
import medalRibbonLinear from '@iconify-icons/solar/medal-ribbon-linear'
import phoneCallingLinear from '@iconify-icons/solar/phone-calling-linear'
import shieldCheckLinear from '@iconify-icons/solar/shield-check-linear'
import starBold from '@iconify-icons/solar/star-bold'
import tagPriceLinear from '@iconify-icons/solar/tag-price-linear'

const REGISTRY = {
  'solar:alt-arrow-down-linear': altArrowDownLinear,
  'solar:arrow-left-linear': arrowLeftLinear,
  'solar:arrow-right-linear': arrowRightLinear,
  'solar:bed-linear': bedLinear,
  'solar:chat-round-linear': chatRoundLinear,
  'solar:city-linear': cityLinear,
  'solar:clock-circle-linear': clockCircleLinear,
  'solar:close-circle-linear': closeCircleLinear,
  'solar:cup-star-linear': cupStarLinear,
  'solar:gallery-linear': galleryLinear,
  'solar:hamburger-menu-linear': hamburgerMenuLinear,
  'solar:leaf-linear': leafLinear,
  'solar:letter-linear': letterLinear,
  'solar:lock-keyhole-linear': lockKeyholeLinear,
  'solar:map-point-linear': mapPointLinear,
  'solar:maximize-square-linear': maximizeSquareLinear,
  'solar:medal-ribbon-linear': medalRibbonLinear,
  'solar:phone-calling-linear': phoneCallingLinear,
  'solar:shield-check-linear': shieldCheckLinear,
  'solar:star-bold': starBold,
  'solar:tag-price-linear': tagPriceLinear,
} as const

export type IconName = keyof typeof REGISTRY

export function registerIcons() {
  for (const [name, data] of Object.entries(REGISTRY)) {
    addIcon(name, data)
  }
}
